"use strict";var __assign=(this&&this.__assign)||function(){__assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++){s=arguments[i];for(var p in s)if(Object.prototype.hasOwnProperty.call(s,p))
t[p]=s[p];}
return t;};return __assign.apply(this,arguments);};Object.defineProperty(exports,"__esModule",{value:true});var path=require("path");var ts=require("typescript");var sourceFile;var typeChecker;var processedTypes=new Set([]);var transformerProgram=(function(program){return function(context){return function(_sourceFile){sourceFile=_sourceFile;typeChecker=program.getTypeChecker();processedTypes=new Set([]);var visitor=function(node){var _a;if(isObjectifyTypeCall(node)){if(!((_a=node.typeArguments)===null||_a===void 0?void 0:_a.length))
return ts.factory.createNull();processedTypes.clear();var typeNode=node.typeArguments[0];var type=typeChecker.getTypeFromTypeNode(typeNode);var props=typeChecker.getPropertiesOfType(type);processedTypes.add(type);return ts.factory.createRegularExpressionLiteral(JSON.stringify(createNestedObject(props)));}
return ts.visitEachChild(node,visitor,context);};return ts.visitNode(sourceFile,visitor);};};});function createNestedObject(props){return props.map(function(symbol){return resolveSymbol(symbol);}).filter(function(resolved){return!!resolved;});}
function resolveSymbol(symbol){if(!(symbol===null||symbol===void 0?void 0:symbol.valueDeclaration))
return null;var type=typeChecker.getTypeOfSymbolAtLocation(symbol,symbol.valueDeclaration);var key=symbol.getName();var required=!(symbol.flags&ts.SymbolFlags.Optional);return __assign({key:key,required:required},resolveType(type,!required));}
function resolveType(type,isOptionalSymbol){var _a;if(isOptionalSymbol===void 0){isOptionalSymbol=false;}
var typeNode=typeChecker.typeToTypeNode(type,undefined,undefined);if(!typeNode||!typeNode.kind){throw new Error('ts-objectify-type: Type could not be transformed to object representation');}
if(isCircular(type,typeNode)){return getReferenceType(type,typeNode,true);}
if(isGenericParameter(type)){return{type:'generic',typeName:typeChecker.typeToString(type),};}
if(type.flags&ts.TypeFlags.Null){return{type:'object',objectType:'null',};}
if(type.flags&ts.TypeFlags.Boolean){return{type:typeChecker.typeToString(type)};}
if(type.isUnion()){if(isOptionalSymbol){var filteredUndefined=type.types.filter(function(_type){return!(_type.flags&ts.TypeFlags.Undefined);});if(filteredUndefined.length===1){return resolveType(filteredUndefined[0]);}
if(filteredUndefined.every(function(i){return i.flags&ts.TypeFlags.BooleanLiteral;})){return{type:typeChecker.typeToString(type)};}}
return{type:'union',unionOf:type.types.map(function(_type){return resolveType(_type);}),};}
if(type.isIntersection()){return{type:'intersection',intersectionOf:type.types.map(function(_type){return resolveType(_type);}),};}
if(!(type.flags&ts.TypeFlags.Object)){return{type:typeChecker.typeToString(type)};}
if(ts.isTypeReferenceNode(typeNode)){processedTypes.add(type);var resolvedType=getReferenceType(type,typeNode);processedTypes.delete(type);return resolvedType;}
if(ts.isTupleTypeNode(typeNode)){return{type:'object',objectType:'tuple',tupleType:getTupleType(type,typeNode),};}
if(ts.isArrayTypeNode(typeNode)){return{type:'object',objectType:'array',arrayType:getArrayType(type),};}
if(ts.isFunctionLike(typeNode)){var signature=(_a=typeChecker.getSignaturesOfType(type,ts.SignatureKind.Call))===null||_a===void 0?void 0:_a[0];var resolvedType=signature?resolveType(typeChecker.getReturnTypeOfSignature(signature)):undefined;return{type:'function',arguments:getFunctionArguments(typeNode),returnType:resolvedType!==null&&resolvedType!==void 0?resolvedType:{type:'void'},};}
if(ts.isTypeLiteralNode(typeNode)){return{type:'object',objectType:'literal',props:createNestedObject(type.getProperties()),};}
return{type:'object',objectType:'unknown'};}
function isCircular(type,typeNode){return processedTypes.has(type);}
function getReferenceType(type,typeNode,isCircular){if(isCircular===void 0){isCircular=false;}
var referenceName=ts.isIdentifier(typeNode.typeName)?typeNode.typeName.text:typeNode.getText();var typeRef=typeChecker.getBaseTypeOfLiteralType(type);var declaration=typeRef.node;var typeArgs=getTypeArguments(type);var resolvedArgs=typeArgs.map(function(_type){return resolveType(_type);});return __assign(__assign({type:'object',objectType:'reference',referenceName:referenceName},((resolvedArgs===null||resolvedArgs===void 0?void 0:resolvedArgs.length)?{typeArguments:resolvedArgs}:{})),(isCircular?{isCircular:true}:{props:createNestedObject(type.getProperties())}));}
function getTupleType(type,typeNode){var typeArgs=getTypeArguments(type);return typeNode.elements.map(function(element,index){var isNamed=ts.isNamedTupleMember(element);return __assign({key:isNamed?element.name.text:index,required:isNamed?!!element.questionToken:!ts.isOptionalTypeNode(element)},resolveType(typeArgs[index]));});}
function getArrayType(type){return resolveType(getTypeArguments(type)[0]);}
function getFunctionArguments(typeNode){return typeNode.parameters.map(function(param){if(!ts.isIdentifier(param.name))
return null;var symbol=typeChecker.getSymbolAtLocation(param.name);if(!(symbol===null||symbol===void 0?void 0:symbol.valueDeclaration))
return null;var type=typeChecker.getTypeOfSymbolAtLocation(symbol,symbol.valueDeclaration);var key=symbol.getName();var required=!param.questionToken;return __assign({key:key,required:required},resolveType(type,!required));}).filter(function(resolved){return!!resolved;});}
function getTypeArguments(type){var typeRef=typeChecker.getBaseTypeOfLiteralType(type);return typeChecker.getTypeArguments(typeRef);}
function isGenericParameter(type){return type.isTypeParameter();}
var correctPaths=[path.join(__dirname,'index.d.ts'),path.join(__dirname,'index.ts')];var correctFunctionName='objectifyType';function isObjectifyTypeCall(node){var _a;if(!ts.isCallExpression(node))
return false;var signature=typeChecker.getResolvedSignature(node);if(!signature)
return false;var declaration=signature.declaration;if(!declaration||ts.isJSDocSignature(declaration))
return false;var importPath=path.join(declaration.getSourceFile().fileName);var isCorrectPath=correctPaths.indexOf(importPath)!==-1;var isCorrectFunction=((_a=declaration.name)===null||_a===void 0?void 0:_a.getText())===correctFunctionName;return isCorrectPath&&isCorrectFunction;}
exports.default=transformerProgram;