import * as path from 'path';
import * as ts from "typescript";
import { objectified } from "./index";

let sourceFile: ts.SourceFile;
let typeChecker: ts.TypeChecker;
let processedTypes = new Set<ts.Type>([]);

const transformerProgram = (
  (program: ts.Program): ts.TransformerFactory<ts.SourceFile> =>
    (context) =>
      (_sourceFile) => {
        sourceFile = _sourceFile;
        typeChecker = program.getTypeChecker();
        processedTypes = new Set<ts.Type>([])

        const visitor = (node: ts.Node): ts.Node => {
          if (isObjectifyTypeCall(node)) {
            if (!node.typeArguments?.length) return ts.factory.createNull();

            processedTypes.clear();
            const typeNode = node.typeArguments[0];
            const type = typeChecker.getTypeFromTypeNode(typeNode);
            const props = typeChecker.getPropertiesOfType(type);
            processedTypes.add(type)

            return ts.factory.createRegularExpressionLiteral(
              JSON.stringify(createNestedObject(props))
            );
          }

          return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(sourceFile, visitor);
      }
);

function createNestedObject(props: ts.Symbol[]): objectified.TypeRepresentation {
  return props
    .map((symbol) => resolveSymbol(symbol))
    .filter((resolved): resolved is objectified.Property => !!resolved);
}

function resolveSymbol(symbol: ts.Symbol): objectified.Property | null {
  if (!symbol?.valueDeclaration) return null;

  const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);

  return {
    key: symbol.getName(),
    required: !(symbol.flags & ts.SymbolFlags.Optional),
    ...resolveType(type)
  } as any
}

function resolveType(type: ts.Type): objectified.Type {
  const typeNode = typeChecker.typeToTypeNode(type, undefined, undefined);

  if (!typeNode || !typeNode.kind) {
    throw new Error('ts-objectify-type: Type could not be transformed to object representation');
  }

  if (isCircular(type, typeNode)) {
    return getReferenceType(type, typeNode, true);
  }

  if (isGenericParameter(type)) {
    return {
      type: 'generic',
      typeName: typeChecker.typeToString(type),
    } as objectified.GenericParameterType;
  }

  if (type.flags & ts.TypeFlags.Null) {
    return {
      type: 'object',
      objectType: 'null'
    } as objectified.NullObjectType;
  }

  if (type.isUnion()) {
    return {
      type: 'union',
      unionOf: type.types.map(_type => resolveType(_type)),
    } as objectified.UnionType;
  }

  if (type.isIntersection()) {
    return {
      type: 'intersection',
      intersectionOf: type.types.map(_type => resolveType(_type)),
    } as objectified.IntersectionType;
  }

  if (!(type.flags & ts.TypeFlags.Object)) {
    return {type: typeChecker.typeToString(type) } as objectified.PrimitiveType;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    processedTypes.add(type);
    const resolvedType = getReferenceType(type, typeNode);
    processedTypes.delete(type);
    return resolvedType;
  }

  if (ts.isTupleTypeNode(typeNode)) {
    return {
      type: 'object',
      objectType: 'tuple',
      tupleType: getTupleType(type, typeNode),
    } as objectified.TupleType;
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return {
      type: 'object',
      objectType: 'array',
      arrayType: getArrayType(type)
    } as objectified.ArrayType;
  }

  if (ts.isFunctionLike(typeNode)) {
    const signature = typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call)?.[0];
    const resolvedType = signature
      ? resolveType(typeChecker.getReturnTypeOfSignature(signature))
      : undefined;

    return {
      type: 'function',
      arguments: getFunctionArguments(typeNode),
      returnType: resolvedType ?? { type: 'void' },
    } as objectified.FunctionType;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return {
      type: 'object',
      objectType: 'literal',
      props: createNestedObject(type.getProperties())
    } as objectified.LiteralObjectType;
  }

  return { type: 'object', objectType: 'unknown' } as objectified.UnknownObjectType;
}

function isCircular(type: ts.Type, typeNode: ts.TypeNode): typeNode is ts.TypeReferenceNode {
  return processedTypes.has(type);
}

function getReferenceType(type: ts.Type, typeNode: ts.TypeReferenceNode, isCircular = false) {
  const referenceName = ts.isIdentifier(typeNode.typeName)
    ? typeNode.typeName.text
    : typeNode.getText();

  const typeRef = typeChecker.getBaseTypeOfLiteralType(type) as ts.TypeReference;
  const declaration = typeRef.node;

  const typeArgs = getTypeArguments(type);
  const resolvedArgs = typeArgs.map(_type => resolveType(_type));

  return {
    type: 'object',
    objectType: 'reference',
    referenceName,
    ...(resolvedArgs?.length ? { typeArguments: resolvedArgs } : {}),
    ...(isCircular
        ? { isCircular: true }
        : { props: createNestedObject(type.getProperties()) }
    ),
  } as objectified.ReferenceType;
}

function getTupleType(type: ts.Type, typeNode: ts.TupleTypeNode): objectified.TupleType['tupleType'] {
  const typeArgs = getTypeArguments(type);

  return typeNode.elements.map((element, index) => {
    const isNamed = ts.isNamedTupleMember(element);

    return {
      key: isNamed ? element.name.text : index,
      required: isNamed ? !!element.questionToken : !ts.isOptionalTypeNode(element),
      ...resolveType(typeArgs[index]),
    };
  })
}

function getArrayType(type: ts.Type): objectified.ArrayType['arrayType'] {
  return resolveType(getTypeArguments(type)[0])
}

function getFunctionArguments(typeNode: ts.SignatureDeclaration): objectified.FunctionType['arguments'] {
  return typeNode.parameters.map((param) => {
    if (!ts.isIdentifier(param.name)) return null;

    const symbol = typeChecker.getSymbolAtLocation(param.name);
    if (!symbol?.valueDeclaration) return null;

    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);

    return {
      key: symbol.getName(),
      required: !param.questionToken,
      ...resolveType(type)
    }
  }).filter((resolved): resolved is objectified.Property<string> => !!resolved)
}

function getTypeArguments(type: ts.Type) {
  const typeRef = typeChecker.getBaseTypeOfLiteralType(type) as ts.TypeReference;
  return typeChecker.getTypeArguments(typeRef);
}

function isGenericParameter(type: ts.Type): boolean {
  return type.isTypeParameter();
}

const correctPaths = [
  path.join(__dirname, 'index.d.ts'),
  path.join(__dirname, 'index.ts')
];

const correctFunctionName = 'objectifyType'

function isObjectifyTypeCall(node: ts.Node): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) return false;

  const signature = typeChecker.getResolvedSignature(node);
  if (!signature) return false;

  const { declaration } = signature;
  if (!declaration || ts.isJSDocSignature(declaration)) return false;

  const importPath = path.join(declaration.getSourceFile().fileName)
  const isCorrectPath = correctPaths.indexOf(importPath) !== -1;
  const isCorrectFunction = declaration.name?.getText() === correctFunctionName;

  return isCorrectPath && isCorrectFunction;
}

export default transformerProgram;
