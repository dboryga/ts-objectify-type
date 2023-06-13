# ts-objectify-type

TypeScript transformer for creating object representation of deeply nested types.


## Table of Contents

- [Key Feature](#key-feature)
  - [Types](#types)
- [Installation](#installation)
- [Usage](#usage)
  - [ts-patch](#ttypescript)
  - [ttypescript](#ttypescript)
  - [Alternatives](#alternatives)
- [Examples](#examples)
  - [Basic](#basic)
  - [Optional Parameter](#optional-parameter)
  - [Primitives](#primitives)
  - [Literal Object](#literal-object)
  - [Null](#null)
  - [Array](#array)
  - [Tuple](#tuple)
  - [Function](#function)
  - [Union](#union)
  - [Intersection](#intersection)
  - [Reference](#reference)
    - [Simple Reference](#simple-reference)
    - [Reference with Generic Parameter](#reference-with-generic-parameter)
    - [Circular Reference](#circular-reference)
    - [Type Alias](#type-alias)
- [Utility Functions](#utility-functions)
  - [Property](#property)
  - [Primitives](#primitives)
  - [Function](#function)
  - [Union / Intersection](#union--intersection)
  - [Array / Tuple](#array--tuple)
  - [Object](#object)
  - [Other](#other)
  - [Groups](#groups)


## Key Feature

The library provides a custom typescript transformer that creates object representation of provided Type.  
To transform a type use `objectifyType` from the `ts-objectify-type` module:

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {  
 //...
}

const obj = objectifyType<ExampleType>();
```

Returned object is of type `objectified.TypeRepresentation`, which is alias for `objectified.Property[]`.


### Types

`objectified` namespace provides all types for the object returned by the `objectifyType` function, and can be also imported from the `ts-objectify-type`.
Check [examples](#examples) for more information.



## Installation

Install `ts-objectify-type` with npm:

```cmd
npm install ts-objectify-type --save-dev
``` 

or yarn:

```cmd
yarn add ts-objectify-type -D
``` 

> #### Required
>
> TypeScript >= 2.4.1



## Usage

TypeScript provides limited support for using custom transformers, but it doesn't have built-in, 
easy-to-use options for this purpose. However, there are alternative solutions available.


### [ts-patch](https://github.com/nonara/ts-patch)

The easiest solution is to use a community-driven library called [ts-patch](https://github.com/nonara/ts-patch),
which offers a way to overcome this limitation and utilize custom transformers with TypeScript projects.
The package is build based on [ttypescript](#ttypescript) (for more info check next section).

1. Install `ts-patch` as a dev-dependency with npm:

```cmd
npm install ts-patch --save-dev
```

or yarn:

```cmd
yarn add ts-patch -D

```

2. Add prepare script (keeps patch persisted after npm install)

```json5
// package.json
{
 "scripts": {
   "prepare": "ts-patch install -s"
 }
}
```

3. In `tsconfig.json` set a path to the transformer in the `compilerOptions` `plugins` array:

```json5
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      { "transform": "ts-objectify-type/transformer" }
    ]
  }
}
```



### [ttypescript](https://github.com/cevek/ttypescript)

TTypescript (Transformer TypeScript) solves the problem by patching on the fly the compile module to use transformers from `tsconfig.json`.
Instead of `tsc` and `tsserver`, use `ttsc` and `ttsserver` wrappers. 
These wrappers try to use locally installed typescript first.
`ttypescript` is also compatible with Webpack and Rollup (check [ttypescript repo](https://github.com/cevek/ttypescript) for more info)

1. Install `ttypescript` as a dev-dependency with npm:

```cmd
npm install ttypescript --save-dev
```

or yarn:

```cmd
yarn add ttypescript -D

```
2. In `tsconfig.json` set a path to the transformer in the `compilerOptions` `plugins` array:

```json5
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      { "transform": "ts-objectify-type/transformer" }
    ]
  }
}
```

3. To build project use `ttsc` instead of `tsc`. All arguments work the same way

```cmd
ttsc
```


### Alternatives

- [ts-loader](https://github.com/TypeStrong/ts-loader#getcustomtransformers) (Webpack)
- [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader#getcustomtransformers-string--program-tsprogram--tscustomtransformers--undefined-defaultundefined) (Webpack)
- [rollup-plugin-typescript2](https://github.com/ezolenko/rollup-plugin-typescript2) (Rollup)



## Examples

There are several type groups, each represented by an interface.
The interfaces are designed to provide the most information from the corresponding type.

### Basic

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {  
  prop: string;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    "key": "prop",
    "required": true,
    "type": "string"
  }
]
```

There are 3 base properties that every *"objectified"* property has:
- `key` *string | number | symbol* - Name of the property
- `required` *boolean* - Whether property is marked as required
- `type` *objectified.TypeValue (string)* - Type of the property. Main idea behind it is to represent what `typeof` keyword would return when used on the type, but with few extra.
You can check all of them in [examples](#examples) section.


### Optional Parameter

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  requiredProp: string;
  optionalProp?: string;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: 'requiredProp',
    required: true,
    type: 'string'
  },
  {
    key: 'optionalProp',
    required: false,
    type: 'string'
  }
];
```

### Primitives

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  primitiveVoid: void;
  primitiveNever: never;
  primitiveNumber: number;
  primitiveString: string;
  primitiveBoolean: boolean;
  primitiveUndefined: undefined;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: 'primitiveVoid',
    required: true,
    type: 'void'
  },
  {
    key: 'primitiveNever',
    required: true,
    type: 'never'
  },
  {
    key: 'primitiveNumber',
    required: true,
    type: 'number'
  },
  {
    key: 'primitiveString',
    required: true,
    type: 'string'
  },
  {
    key: 'primitiveBoolean',
    required: true,
    type: 'boolean'
  },
  {
    key: 'primitiveUndefined',
    required: true,
    type: 'undefined'
  }
];
```

Generated properties type: `objectified.PrimitiveType`


### Literal Object

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  literalObj: {
    prop1: string;
    prop2: number;
  };
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "literalObj",
    required: true,
    type: "object",
    objectType: "literal",
    props: [
      {
        key: "prop1",
        required: true,
        type: "string"
      },
      {
        key: "prop2",
        required: true,
        type: "number"
      }
    ]
  }
];
```


### Null

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  nullProp: null;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "nullProp",
    required: true,
    type: "object",
    objectType: "null",
  }
];
```

> `null` is technically primitive, but when `typeof` is used, it returns `"object"`.  
> So in generated object `type="object"` and `objectType="null"` 


### Array

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  simpleArray: string[];
  classArray: Array<string>;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "simpleArray",
    required: true,
    type: "object",
    objectType: "array",
    arrayType: {
      type: "string"
    }
  },
  {
    key: "classArray",
    required: true,
    type: "object",
    objectType: "array",
    arrayType: {
        type: "string"
    }
  }
];
```

Generated properties type: `objectified.ArrayType`
- `arrayType` *(objectified.Type)* - represents type of the array


### Tuple

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  simpleTuple: [string, number?];
  namedTuple: [
    one: string,
    two?: number
  ];
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "simpleTuple",
    required: true,
    type: "object",
    objectType: "tuple",
    tupleType: [
      {
        key: 0,
        required: true,
        type: "string"
      },
      {
        key: 1,
        required: false,
        type: "number"
      }
    ]
  },
  {
    key: "namedTuple",
    required: true,
    type: "object",
    objectType: "tuple",
    tupleType: [
      {
        key: "one",
        required: false,
        type: "string"
      },
      {
        key: "two",
        required: true,
        type: "number"
      }
    ]
  }
];
```

Generated properties type: `objectified.TupleType`
- `tupleType` *objectified.Property[]* - an array representation of tuple individual types 


### Function

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  voidFn: () => void;
  argsFn: (arg1: string, arg2: number) => string;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "voidFn",
    required: true,
    type: "function",
    arguments: [],
    returnType: {
      type: "void"
    }
  },
  {
    key: "argsFn",
    required: true,
    type: "function",
    arguments: [
      {
        key: "arg1",
        required: true,
        type: "string"
      },
      {
        key: "arg2",
        required: true,
        type: "number"
      }
    ],
    returnType: {
      type: "string"
    }
  }
];
```

Generated property type: `objectified.FunctionType`
- `arguments` *objectified.Property[]* - an array of function arguments representations
- `returnType` *objectified.Type* - function return type representation


### Union

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  primitivesUnion: string | number;
  objsUnion: { a: string } | { b: number };
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "primitivesUnion",
    required: true,
    type: "union",
    unionOf: [
      {
        type: "string"
      },
      {
        type: "number"
      }
    ]
  },
  {
    key: "objsUnion",
    required: true,
    type: "union",
    unionOf: [
      {
        type: "object",
        objectType: "literal",
        props: [
          {
            key: "a",
            required: true,
            type: "string"
          }
        ]
      },
      {
        type: "object",
        objectType: "literal",
        props: [
          {
            key: "b",
            required: true,
            type: "number"
          }
        ]
      }
    ]
  }
];
```

Generated properties type: `objectified.UnionType`
- `unionOf` *objectified.Type[]* - type representation of individual union members


### Intersection

```ts
import { objectifyType } from 'ts-objectify-type';

interface ExampleType {
  primitivesIntersection: string & number; // = never
  objsIntersection: { a: string } & { b: number };
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "primitivesIntersection",
    required: true,
    type: "never"
  },
  {
    key: "objsIntersection",
    required: true,
    type: "intersection",
    intersectionOf: [
      {
        type: "object",
        objectType: "literal",
        props: [
          {
            key: "a",
            required: true,
            type: "string"
          }
        ]
      },
      {
        type: "object",
        objectType: "literal",
        props: [
          {
            key: "b",
            required: true,
            type: "number"
          }
        ]
      }
    ]
  }
];
```

Generated properties type: `objectified.IntersectionType`
- `intersectionOf` *objectified.Type[]* - type representation of individual intersection members

> Note that `primitivesIntersection` is set as `string & number` but they have no common properties
> and typescript treats it as a `never` and same is returned when objectified.


### Reference

#### Simple Reference

```ts
import { objectifyType } from 'ts-objectify-type';

export interface SimpleInterface {
  prop: string;
}

interface ExampleType {
  simpleRef: SimpleInterface;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "simpleRef",
    required: true,
    type: "object",
    objectType: "reference",
    referenceName: "SimpleInterface",
    props: [
      {
        key: "prop",
        required: true,
        type: "string"
      }
    ]
  }
];
```

Generated property type: `objectified.ReferenceType`
- `referenceName` *string* - name of the referenced type
- `props` *objectified.Type[]* - same as in literal object, the nested properties are represented.


#### Reference With Generic Parameter

```ts
import { objectifyType } from 'ts-objectify-type';

export interface InterfaceWithGeneric<T> {
  prop: T;
}

interface ExampleType {
  genericRef: InterfaceWithGeneric<string>;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "refWithGeneric",
    required: true,
    type: "object",
    objectType: "reference",
    referenceName: "InterfaceWithGeneric",
    typeArguments: [
      {
        type: "string"
      }
    ],
    props: [
      {
        key: "prop",
        required: true,
        type: "string"
      }
    ]
  }
];
```

Generated property type: `objectified.ReferenceType`
- `typeArguments` *objectified.Type[]* - an array of generic parameters representations
-

#### Circular Reference

```ts
import { objectifyType } from 'ts-objectify-type';

export interface InterfaceCircular {
  selfRef: InterfaceCircular;
}

interface ExampleType {
  circularRef: InterfaceCircular;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "refCircular",
    required: true,
    type: "object",
    objectType: "reference",
    referenceName: "InterfaceCircular",
    props: [
      {
        key: "selfRef",
        required: true,
        type: "object",
        objectType: "reference",
        referenceName: "InterfaceCircular",
        isCircular: true
      }
    ]
  }
];
```

Generated properties type: `objectified.ReferenceType`, 
- `isCircular` *boolean* - indicates whether the property references a type that has already been referenced earlier in the same object


#### Type Alias

```ts
import { objectifyType } from 'ts-objectify-type';

export interface SimpleInterface {
  prop: string;
}

type AliasType = SimpleInterface;

interface ExampleType {
  aliasRef: AliasType;
}

const obj = objectifyType<ExampleType>();
```

```ts
// Generated result:
const obj = [
  {
    key: "aliasRef",
    required: true,
    type: "object",
    objectType: "reference",
    referenceName: "SimpleInterface",
    props: [
      {
        key: "prop",
        required: true,
        type: "string"
      }
    ]
  }
];
```

Generated properties type: `objectified.ReferenceType`,

> Note that even though the type of `aliasRef` is set as `AliasType`, the `referenceName` is directly `SimpleInterface`


## Utility Functions

The following utility functions are available in the `objectified` namespace to narrow down `objectified.Type`.  
All functions take one argument of `objectified.Type` type.

### Property

- `isProperty(type)` - has `key` and `required` properties
- `isRequired(type)` - `required` is `true`
- `isOptional(type)` - `required` is `false`

### Primitive Types

- `isString(type)` - whether is *string*
- `isNumber(type)` - whether is *number*
- `isBoolean(type)` - whether is *boolean*
- `isUndefined(type)` - whether is *undefined*
- `isNull(type)` - whether is *null*

### Function

- `isFunction(type)` - whether is *function*

### Union / Intersection

- `isUnion(type)` - whether is *union*
- `isIntersection(type)` - whether is *intersection*

### Array / Tuple

- `isArray(type)` - whether is *array*
- `isTuple(type)` - whether is *tuple*
- `isArrayOrTuple(type)` - whether is *array* or *tuple*

### Object

- `isLiteralObject(type)` - whether is *literal object*
- `isReference(type)` - whether is *reference*
- `isCircularReference(type)` - whether is *circular reference*
- `hasProps(type)` - whether it has `props` property (meaning *reference* or *literal object*)
- `isUnknownObject(type)` - unknown object represents error or unsupported type (please [report a bug](https://github.com/dboryga/ts-objectify-type/issues) when encountered)

### Other

- `isVoid(type)` - whether is *void*
- `isNever(type)` - whether is *never*
- `isGenericParameter(type)` - whether is *generic type parameter*

### Groups

- `isNotNullPrimitive(type)` - *string*, *number*, *boolean* or *undefined*
- `isPrimitive(type)` - *"Not Null Primitive"*, or *null*
- `isNotObject(type)` - *"Not Null Primitive"*, *void* or *never*
- `isNotNullObject(type)` - *literal object*, *array*, *tuple* *reference*, *unknown object*
- `isObject(type)` - *Not Null Object* or *null*
