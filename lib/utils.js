/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 19.02.13
 * Time: 8:29
 *
 * E = mc^2
 */

var $util = require('util');
var $path = require('path');
var $fs = require('fs');
var error = require('./error');

exports.exists = typeof $fs.exists === 'function' ? $fs.exists : $path.exists;
exports.existsSync = typeof $fs.existsSync === 'function' ? $fs.existsSync : $path.existsSync;

function isObject(val) { return (Object.prototype.toString.call(val) === '[object Object]') }
function isArray(val) { return $util.isArray(val) }
function isDate(val) { return $util.isDate(val) && val.toString() !== 'Invalid Date' }
function isError(val) { return $util.isError(val) }
function isRegExp(val) { return $util.isRegExp(val) }

function isTypeOf(val, type) { return (typeof val === type) }
function isString(val) { return isTypeOf(val, 'string') }
function isNumber(val) { return isTypeOf(val, 'number') }
function isBoolean(val) { return isTypeOf(val, 'boolean') }
function isFunction(val) { return isTypeOf(val, 'function') }
function isUndefined(val) { return isTypeOf(val, 'undefined') }
function isNotUndefined(val) { return !isUndefined(val) }
function hasKey() {

    var args = Array.prototype.slice.call(arguments);
    var obj = args.shift();
    var result = true;

    if ( !args.length || !isObject(obj) ) return false;
    args.forEach(function(key) {

        if (isArray(key)) {
            key.forEach(function(k) {
                if ( obj == null || isUndefined(obj[key]) ) return result = false;
            });
        }
        else {
            if ( obj == null || isUndefined(obj[key]) ) return result = false;
            obj = obj[key];
        }

    });

    return result;
}

/**
 * Ищет есть ли нужное значение в массиве или объекте
 * @param haystack
 * @param needle
 * @returns {boolean}
 */
function hasVal(haystack, needle) {

    if (isArray(haystack) || isObject(haystack)) {
        for (var key in haystack) {
            if (haystack[key] === needle) return true;
        }
    }
    return false;
}

function deleteByVal(haystack, needle) {
    if (isArray(haystack) || isObject(haystack)) {
        for (var key in haystack) {
            if (haystack[key] === needle) {
                if (isArray(haystack)) haystack.splice(key,1);
                if (isObject(haystack)) delete haystack[key];
            }
        }
    }
}

function isSet(val) {
    if (isArray(val)) return !!(val.length);
    if (isObject(val)) return !!(Object.keys(val).length);
    if (isNumber(val)) return !isNaN(val);
    return toBoolean(val);
}

function isEmpty(val) {
    return !isSet(val);
}

function isInstanceOf(val, Instance) {
    return (val instanceof Instance)
}

function isTuburError(err) {
    return isInstanceOf(err, error.TuburError);
}
//function isTypeError(err) {
//    return isInstanceOf(err, error.TypeError);
//}
function isSystemError(err) {
    return isInstanceOf(err, error.SystemError);
}
function isValidationError(err) {
    return isInstanceOf(err, error.ValidationError);
}
function isSyntaxError(err) {
    return isInstanceOf(err, error.SyntaxError);
}
function isDbError(err) {
    return isInstanceOf(err, error.DbError);
}
function isAccessError(err) {
    return isInstanceOf(err, error.AccessError);
}
function isUnknownError(err) {
    return isInstanceOf(err, error.UnknownError);
}
function isMultiError(err) {
    return isInstanceOf(err, error.MultiError);
}

function isInteger(val) {
    return isNumber(val) && (val.toString().match(/^(?:-?(?:0|[1-9][0-9]*))$/) != null)
}
function isFloat(val) {
    return isNumber(val) && (val.toString().match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/) != null) && !isInteger(val)
}

function isEmail(str) {
    return isString(str) && (str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/) != null);
}
function isUrl(str) {
    return isString(str) && (str.length < 2083) && (str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i) != null);
}
function isIP4(str) {
    if (/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(str)) {
        var parts = str.split('.').sort();
        // no need to check for < 0 as regex won't match in that case
        return !(parts[3] > 255);
    }
    return false;
}
function isIP6(str) {
    return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/.test(str))
}
function isIP(str) {
    if (isIP4(str)) return 4;
    else if (isIP6(str)) return 6;
    else return 0;
}

function toFloat(val) {
    return parseFloat(val)
}
function toInt(val, radix) {
    return parseInt(val, radix || 10)
}
function toBoolean(val) {
    return !(!val || val == '0' || val == 'false' || val == '')
}


function clone(val) {
    var result = val;
    if (isArray(val)) {
        result = [];
        val.forEach(function(item) {
            if (isArray(item) || isObject(item)) result.push(clone(item));
            else result.push(item);
        });
    }
    if (isObject(val)) {
        result = {};
        for (var x in val) {
            var item = val[x];
            if (isArray(item) || isObject(item)) result[x] = clone(item);
            else result[x] = item;
        }
    }
    return result;
}

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

/**
 * Рекурсивное создание директорий
 *
 * @param {String} path путь
 *
 * @returns {Boolean}
 */
function createDirReq(path) {

    var dirNameList;
    var subpath = '';

    if (typeof path !== 'string' || !path.length) return false;

    path = $path.normalize(path);
    dirNameList = path.split('/');

    for (var i = 0, n = dirNameList.length; i < n; i++) {
        subpath += '/' + dirNameList[i];
        if (!exports.existsSync(subpath) || !$fs.statSync(subpath).isDirectory()) $fs.mkdirSync(subpath);
    }
    return true;
}

exports.isInstanceOf = isInstanceOf;
exports.isTypeOf = isTypeOf;

exports.isTuburError        = isTuburError;
//exports.isTypeError        = isTypeError;
exports.isSystemError       = isSystemError;
exports.isSyntaxError       = isSyntaxError;
exports.isValidationError   = isValidationError;
exports.isAccessError       = isAccessError;
exports.isUnknownError      = isUnknownError;
exports.isDbError           = isDbError;
exports.isMultiError        = isMultiError;

exports.isObject = isObject;
exports.isArray = isArray;
exports.isDate = isDate;
exports.isError = isError;
exports.isBoolean = exports.isBool = isBoolean;
exports.isFunction = isFunction;
exports.isUndefined = isUndefined;
exports.isNotUndefined = isNotUndefined;

exports.isSet = isSet;
exports.isEmpty = isEmpty;
exports.isInteger = exports.isInt = isInteger;
exports.isFloat = isFloat;
exports.isNumber = isNumber;
exports.isString = exports.isStr = isString;
exports.isRegExp = isRegExp;
exports.isIP = isIP;
exports.isIP4 = isIP4;
exports.isIP6 = isIP6;
exports.isUrl = isUrl;
exports.isEmail = isEmail;

exports.toBoolean = exports.toBool = toBoolean;
exports.toFloat = toFloat;
exports.toInt = toInt;

exports.hasKey = hasKey;
exports.hasVal = hasVal;
exports.delByVal = deleteByVal;

exports.rnd = rnd;
exports.clone = clone;
exports.createDirReq = createDirReq;