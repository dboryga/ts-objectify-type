export declare function objectifyType<_Type extends object>(): objectified.TypeRepresentation<_Type> | undefined;
export declare namespace objectified {
    type TypeRepresentation<_Type extends object = any> = Property<keyof _Type>[];
    type Property<_Keys extends string | number | symbol = string | number | symbol> = Type & {
        key: _Keys;
        required: boolean;
    };
    type Type = UnionType | TupleType | ArrayType | FunctionType | PrimitiveType | ReferenceType | NullObjectType | IntersectionType | LiteralObjectType | UnknownObjectType | GenericParameterType;
    type PrimitiveTypeValue = 'string' | 'number' | 'boolean' | 'undefined';
    type ExtendedPrimitiveTypeValue = PrimitiveTypeValue | 'void' | 'never';
    type NonPrimitiveTypeValue = 'union' | 'object' | 'generic' | 'function' | 'intersection';
    type TypeValue = ExtendedPrimitiveTypeValue | NonPrimitiveTypeValue;
    type ObjectTypeValue = 'null' | 'array' | 'tuple' | 'literal' | 'unknown' | 'reference';
    interface BaseType<_TypeValue extends TypeValue = TypeValue> {
        type: _TypeValue;
    }
    interface PrimitiveType<_TypeValue extends ExtendedPrimitiveTypeValue = ExtendedPrimitiveTypeValue> extends BaseType {
        type: _TypeValue;
    }
    interface GenericParameterType<_Type extends any = any> extends BaseType<'generic'> {
        typeName: string;
    }
    interface FunctionType extends BaseType<'function'> {
        arguments: Property[];
        returnType: Type;
    }
    interface UnionType extends BaseType<'union'> {
        unionOf: Type[];
    }
    interface IntersectionType extends BaseType<'intersection'> {
        intersectionOf: Type[];
    }
    interface ObjectType<_ObjectTypeValue extends ObjectTypeValue = ObjectTypeValue> extends BaseType<'object'> {
        objectType: _ObjectTypeValue;
    }
    interface LiteralObjectType extends ObjectType<'literal'> {
        props: Type[];
    }
    interface ArrayType extends ObjectType<'array'> {
        arrayType: Type;
    }
    interface TupleType extends ObjectType<'tuple'> {
        tupleType: Property[];
    }
    interface ReferenceType extends ObjectType<'reference'> {
        referenceName: string;
        typeArguments?: Type[];
        props?: Type[];
        isCircular?: true;
    }
    type NullObjectType = ObjectType<'null'>;
    type UnknownObjectType = ObjectType<'unknown'>;
    /**
     * Helper functions
     */
    const isProperty: (type: Type) => type is Property<string | number | symbol>;
    const isRequired: (type: Type) => type is Property<string | number | symbol> & {
        optional: false;
    };
    const isOptional: (type: Type) => type is Property<string | number | symbol> & {
        optional: true;
    };
    const isString: (type: Type) => type is {
        type: 'string';
    };
    const isNumber: (type: Type) => type is {
        type: 'number';
    };
    const isBoolean: (type: Type) => type is {
        type: 'boolean';
    };
    const isUndefined: (type: Type) => type is {
        type: 'undefined';
    };
    const isNull: (type: Type) => type is IntersectionType;
    const isFunction: (type: Type) => type is FunctionType;
    const isUnion: (type: Type) => type is UnionType;
    const isIntersection: (type: Type) => type is IntersectionType;
    const isArray: (type: Type) => type is ArrayType;
    const isTuple: (type: Type) => type is TupleType;
    const isArrayOrTuple: (type: Type) => type is TupleType;
    const isLiteralObject: (type: Type) => type is LiteralObjectType;
    const isReference: (type: Type) => type is ReferenceType;
    const isCircularReference: (type: Type) => type is ReferenceType & {
        isCircular: true;
    };
    const isUnknownObject: (type: Type) => type is UnknownObjectType;
    const hasProps: (type: Type) => type is (ReferenceType | LiteralObjectType) & {
        props: Type[];
    };
    const isVoid: (type: Type) => type is {
        type: 'void';
    };
    const isNever: (type: Type) => type is {
        type: 'never';
    };
    const isGenericParameter: (type: Type) => type is GenericParameterType<any>;
    const isNotNullPrimitive: (type: Type) => type is PrimitiveType<PrimitiveTypeValue>;
    const isPrimitive: (type: Type) => type is PrimitiveType<PrimitiveTypeValue>;
    const isNotObject: (type: Type) => type is PrimitiveType<ExtendedPrimitiveTypeValue>;
    const isObject: (type: Type) => type is (TupleType & ObjectType<ObjectTypeValue>) | (ArrayType & ObjectType<ObjectTypeValue>) | (ReferenceType & ObjectType<ObjectTypeValue>) | (NullObjectType & ObjectType<ObjectTypeValue>) | (LiteralObjectType & ObjectType<ObjectTypeValue>) | (UnknownObjectType & ObjectType<ObjectTypeValue>);
    const isNotNullObject: (type: Type) => type is (TupleType & ObjectType<ObjectTypeValue>) | (ArrayType & ObjectType<ObjectTypeValue>) | (ReferenceType & ObjectType<ObjectTypeValue>) | (NullObjectType & ObjectType<ObjectTypeValue>) | (LiteralObjectType & ObjectType<ObjectTypeValue>) | (UnknownObjectType & ObjectType<ObjectTypeValue>);
}
