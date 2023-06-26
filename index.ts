export function objectifyType<
  _Type extends object
>(): objectified.TypeRepresentation<_Type> | undefined {
  return undefined;
}

export namespace objectified {
  export type TypeRepresentation<_Type extends object = any> = Property<keyof _Type>[];

  export type Property<
    _Keys extends string | number | symbol = string | number | symbol
  > = Type & {
    key: _Keys;
    required: boolean;
  }

  export type Type =
    | UnionType
    | TupleType
    | ArrayType
    | FunctionType
    | PrimitiveType
    | ReferenceType
    | NullObjectType
    | IntersectionType
    | LiteralObjectType
    | UnknownObjectType
    | GenericParameterType;

  export type PrimitiveTypeValue =
    | 'string'
    | 'number'
    | 'boolean'
    | 'undefined'

  export type ExtendedPrimitiveTypeValue =
    | PrimitiveTypeValue
    | 'void'
    | 'never'

  export type NonPrimitiveTypeValue =
    | 'union'
    | 'object'
    | 'generic'
    | 'function'
    | 'intersection'

  export type TypeValue = ExtendedPrimitiveTypeValue | NonPrimitiveTypeValue;

  export type ObjectTypeValue =
    | 'null'
    | 'array'
    | 'tuple'
    | 'literal'
    | 'unknown'
    | 'reference';

  export interface BaseType<_TypeValue extends TypeValue = TypeValue> {
    type: _TypeValue;
  }

  export interface PrimitiveType<
    _TypeValue extends ExtendedPrimitiveTypeValue = ExtendedPrimitiveTypeValue
  > extends BaseType {
    type: _TypeValue;
  }

  export interface GenericParameterType<_Type extends any = any> extends BaseType<'generic'> {
    typeName: string;
  }

  export interface FunctionType extends BaseType<'function'> {
    arguments: Property[],
    returnType: Type,
  }

  export interface UnionType extends BaseType<'union'> {
    unionOf: Type[];
  }

  export interface IntersectionType extends BaseType<'intersection'> {
    intersectionOf: Type[];
  }

  export interface ObjectType<
    _ObjectTypeValue extends ObjectTypeValue = ObjectTypeValue
  > extends BaseType<'object'> {
    objectType: _ObjectTypeValue;
  }

  export interface LiteralObjectType extends ObjectType<'literal'> {
    props: Type[];
  }

  export interface ArrayType extends ObjectType<'array'> {
    arrayType: Type;
  }

  export interface TupleType extends ObjectType<'tuple'> {
    tupleType: Property[];
  }

  export interface ReferenceType extends ObjectType<'reference'> {
    referenceName: string;
    typeArguments?: Type[];
    props?: Type[];
    isCircular?: true;
  }

  export type NullObjectType = ObjectType<'null'>;

  export type UnknownObjectType = ObjectType<'unknown'>;

  /**
   * Helper functions
   */
  // Property
  export const isProperty = (type: Type): type is Property  => 'key' in type && 'required' in type;
  export const isRequired = (type: Type): type is Property & { optional: false } => isProperty(type) && type.required === true;
  export const isOptional = (type: Type): type is Property & { optional: true } => isProperty(type) && type.required === false;

  // Primitive types
  export const isString = (type: Type): type is {type: 'string'} => type.type === 'string';
  export const isNumber = (type: Type): type is {type: 'number'} => type.type === "number";
  export const isBoolean = (type: Type): type is {type: 'boolean'} => type.type === "boolean";
  export const isUndefined = (type: Type): type is {type: 'undefined'} => type.type === "undefined";
  export const isNull = (type: Type): type is IntersectionType  => isObject(type) && type.objectType === 'null';

  // Function
  export const isFunction = (type: Type): type is FunctionType  => type.type === 'function';

  // Union / Intersection
  export const isUnion = (type: Type): type is UnionType  => type.type === 'union';
  export const isIntersection = (type: Type): type is IntersectionType  => type.type === 'intersection';

  // Array / Tuple
  export const isArray = (type: Type): type is ArrayType  => isObject(type) && type.objectType === 'array';
  export const isTuple = (type: Type): type is TupleType  => isObject(type) && type.objectType === 'tuple';
  export const isArrayOrTuple = (type: Type): type is TupleType  => isArray(type) && isTuple(type);

  // Object
  export const isLiteralObject = (type: Type): type is LiteralObjectType  => isObject(type) && type.objectType === 'literal';
  export const isReference = (type: Type): type is ReferenceType  => isObject(type) && type.objectType === 'reference';
  export const isCircularReference = (type: Type): type is ReferenceType & {isCircular: true}  => isReference(type) && type.isCircular === true;
  export const isUnknownObject = (type: Type): type is UnknownObjectType  => isObject(type) && type.objectType === 'unknown';
  export const hasProps = (type: Type): type is (ReferenceType | LiteralObjectType) & {props: Type[]}  =>
    (isLiteralObject(type) || isReference(type)) && 'props' in type;

  //Other
  export const isVoid = (type: Type): type is {type: 'void'} => type.type === "void";
  export const isNever = (type: Type): type is {type: 'never'} => type.type === "never";
  export const isGenericParameter = (type: Type): type is GenericParameterType  => type.type === 'generic';

  // Groups
  export const isNotNullPrimitive = (type: Type): type is PrimitiveType<PrimitiveTypeValue>  => isString(type) || isNumber(type) || isBoolean(type) || isUndefined(type);
  export const isPrimitive = (type: Type): type is PrimitiveType<PrimitiveTypeValue>  => isNotNullPrimitive(type) || isNull(type);
  export const isNotObject = (type: Type): type is PrimitiveType  => isPrimitive(type) || isVoid(type) || isNever(type);
  export const isObject = (type: Type): type is Type & ObjectType  => type.type === 'object';
  export const isNotNullObject = (type: Type): type is Type & ObjectType  => isObject(type) && type.objectType !== 'null';





}