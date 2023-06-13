"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectified = void 0;
var objectified;
(function (objectified) {
    // Helper functions
    objectified.isProperty = function (type) { return 'key' in type && 'required' in type; };
    objectified.isRequired = function (type) { return objectified.isProperty(type) && type.required === true; };
    objectified.isOptional = function (type) { return objectified.isProperty(type) && type.required === false; };
    objectified.isVoid = function (type) { return type.type === "void"; };
    objectified.isNever = function (type) { return type.type === "never"; };
    objectified.isString = function (type) { return type.type === 'string'; };
    objectified.isNumber = function (type) { return type.type === "number"; };
    objectified.isBoolean = function (type) { return type.type === "boolean"; };
    objectified.isUndefined = function (type) { return type.type === "undefined"; };
    objectified.isPrimitive = function (type) { return type.type === 'string'; };
    objectified.isGenericParameter = function (type) { return type.type === 'generic'; };
    objectified.isFunction = function (type) { return type.type === 'function'; };
    objectified.isUnion = function (type) { return type.type === 'union'; };
    objectified.isIntersection = function (type) { return type.type === 'intersection'; };
    objectified.isObject = function (type) { return type.type === 'object'; };
    objectified.isNull = function (type) { return objectified.isObject(type) && type.objectType === 'null'; };
    objectified.isLiteralObject = function (type) { return objectified.isObject(type) && type.objectType === 'literal'; };
    objectified.isArray = function (type) { return objectified.isObject(type) && type.objectType === 'array'; };
    objectified.isTuple = function (type) { return objectified.isObject(type) && type.objectType === 'tuple'; };
    objectified.isReference = function (type) { return objectified.isObject(type) && type.objectType === 'reference'; };
    objectified.isCircularReference = function (type) { return objectified.isReference(type) && type.isCircular === true; };
    objectified.isUnknownObject = function (type) { return objectified.isObject(type) && type.objectType === 'unknown'; };
    objectified.hasProps = function (type) {
        return (objectified.isLiteralObject(type) || objectified.isReference(type)) && 'props' in type;
    };
})(objectified = exports.objectified || (exports.objectified = {}));
