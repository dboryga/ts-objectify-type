"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectified = exports.objectifyType = void 0;
function objectifyType() {
    return undefined;
}
exports.objectifyType = objectifyType;
;
var objectified;
(function (objectified) {
    /**
     * Helper functions
     */
    // Property
    objectified.isProperty = function (type) { return 'key' in type && 'required' in type; };
    objectified.isRequired = function (type) { return objectified.isProperty(type) && type.required === true; };
    objectified.isOptional = function (type) { return objectified.isProperty(type) && type.required === false; };
    // Primitive types
    objectified.isString = function (type) { return type.type === 'string'; };
    objectified.isNumber = function (type) { return type.type === "number"; };
    objectified.isBoolean = function (type) { return type.type === "boolean"; };
    objectified.isUndefined = function (type) { return type.type === "undefined"; };
    objectified.isNull = function (type) { return objectified.isObject(type) && type.objectType === 'null'; };
    // Function
    objectified.isFunction = function (type) { return type.type === 'function'; };
    // Union / Intersection
    objectified.isUnion = function (type) { return type.type === 'union'; };
    objectified.isIntersection = function (type) { return type.type === 'intersection'; };
    // Array / Tuple
    objectified.isArray = function (type) { return objectified.isObject(type) && type.objectType === 'array'; };
    objectified.isTuple = function (type) { return objectified.isObject(type) && type.objectType === 'tuple'; };
    objectified.isArrayOrTuple = function (type) { return objectified.isArray(type) && objectified.isTuple(type); };
    // Object
    objectified.isLiteralObject = function (type) { return objectified.isObject(type) && type.objectType === 'literal'; };
    objectified.isReference = function (type) { return objectified.isObject(type) && type.objectType === 'reference'; };
    objectified.isCircularReference = function (type) { return objectified.isReference(type) && type.isCircular === true; };
    objectified.isUnknownObject = function (type) { return objectified.isObject(type) && type.objectType === 'unknown'; };
    objectified.hasProps = function (type) {
        return (objectified.isLiteralObject(type) || objectified.isReference(type)) && 'props' in type;
    };
    //Other
    objectified.isVoid = function (type) { return type.type === "void"; };
    objectified.isNever = function (type) { return type.type === "never"; };
    objectified.isGenericParameter = function (type) { return type.type === 'generic'; };
    // Groups
    objectified.isNotNullPrimitive = function (type) { return objectified.isString(type) || objectified.isNumber(type) || objectified.isBoolean(type) || objectified.isUndefined(type); };
    objectified.isPrimitive = function (type) { return objectified.isNotNullPrimitive(type) || objectified.isNull(type); };
    objectified.isNotObject = function (type) { return objectified.isPrimitive(type) || objectified.isVoid(type) || objectified.isNever(type); };
    objectified.isObject = function (type) { return type.type === 'object'; };
    objectified.isNotNullObject = function (type) { return objectified.isObject(type) && type.objectType !== 'null'; };
})(objectified = exports.objectified || (exports.objectified = {}));
