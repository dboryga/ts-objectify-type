export declare function objectifyType<
  _Type extends object
>(): objectified.TypeRepresentation<_Type>;

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
    | 'void'
    | 'never'
    | 'string'
    | 'number'
    | 'boolean'
    | 'undefined'

  export type NonPrimitiveTypeValue =
    | 'union'
    | 'object'
    | 'generic'
    | 'function'
    | 'intersection'

  export type TypeValue = PrimitiveTypeValue | NonPrimitiveTypeValue;

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
    _TypeValue extends PrimitiveTypeValue = PrimitiveTypeValue
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
}