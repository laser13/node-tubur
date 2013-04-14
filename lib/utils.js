/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 19.02.13
 * Time: 8:29
 *
 * E = mc^2
 */

var __utils = module.exports = exports,

    $util = require('util'),
    $clc = require('cli-color'),

    __$__;

function isObject(val) { return (Object.prototype.toString.call(val) === '[object Object]') }
function isArray(val) { return $util.isArray(val) }
function isDate(val) { return $util.isDate(val) }
function isError(val) { return $util.isError(val) }
function isRegExp(val) { return $util.isRegExp(val) }

function isTypeOf(val, type) { return (typeof val === type) }
function isString(val) { return isTypeOf(val, 'string') }
function isNumber(val) { return isTypeOf(val, 'number') }
function isBoolean(val) { return isTypeOf(val, 'boolean') }
function isFunction(val) { return isTypeOf(val, 'function') }
function isUndefined(val) { return isTypeOf(val, 'undefined') }
function isNotUndefined(val) { return !isUndefined(val) }
function hasKey(obj, key) { return isNotUndefined(obj[key]) }

function isInstanceOf(val, Instance) { return (val instanceof Instance) }

function isInteger(val) { return val.match(/^(?:-?(?:0|[1-9][0-9]*))$/); }
function isFloat(val) { return val !== '' && val.match(/^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/); }

function isEmail(str)
{
    return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
}
function isUrl(str)
{
    return str.length < 2083 && str.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
}

function isIP4(str)
{
    if (/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/.test(str)) {
        var parts = str.split('.').sort();
        // no need to check for < 0 as regex won't match in that case
        return !(parts[3] > 255);
    }
    return false;
}

function isIP6(str) { return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/.test(str)) }

function isIP(str)
{
    if (isIP4(str)) return 4;
    else if (isIP6(str)) return 6;
    else return 0;
}

function toFloat(val) { return parseFloat(val) }
function toInt(val, radix) { return parseInt(this.str, radix || 10) }
function toBoolean(val) { return !(!val || val == '0' || val == 'false' || val == '') }


__utils.clone = function(obj)
{
    var res = {};
    for (var x in obj)
    {
        res[x] = obj[x];
    }
    return res;
};

__utils.dump = function()
{
    $util.log("\n============================================");
    var args = Array.prototype.slice.call(arguments),
        depth = 3,
        color = true;

    if (args.length > 1)
    {
        var _depth = args[args.length - 1];

        if ( (typeof _depth === "number") && _depth >= 0) {
            depth = args.pop();
        }

    }

    args.forEach(function(v) {
        $util.puts($util.inspect(v, true, depth, true));
    });
};

__utils.Log = function(options)
{
    options = options || {};

    options.showHidden = options.showHidden || false;
    options.depth = options.depth || 3;
    options.colors = options.colors || false;
    options.trace = options.trace || false;
    options.header = (typeof options.header === "undefined") ? true : options.header;

    options.title = options.title || '';

    return function()
    {
        var args = Array.prototype.slice.call(arguments),
            filename = null,
            err = null,
            stack = null;

        if (args.length > 1)
        {
            var last = args[args.length - 1];

            if (last && typeof last === "object")
            {
                if (typeof last.depth !== "undefined")
                {
                    options.depth = last.depth;
                    args.pop();
                }
                if (typeof last.trace !== "undefined")
                {
                    options.trace = last.trace;
                    args.pop();
                }
                if (typeof last.color !== "undefined")
                {
                    options.color = last.color;
                    args.pop();
                }
            }
        }

        if (options.trace)
        {
            err = new Error;
            err.name = 'Trace';
            err.message = 'Error';
            Error.captureStackTrace(err, arguments.callee);
            stack = err.stack.split("\n")[1];
        }

        if (options.header)
        {
            var lineT = "╔======================================================================================================================╗",
                lineB = "╚======================================================================================================================╝",
                lineV = "║",
                text = options.title,
                date = new Date().toLocaleString();


            var str1 = lineV + '  ' + date + ' - ' + text;
            var end1 = []; end1.length = 120 - str1.length; end1 = end1.join(' ') + lineV;

            var header = "\n" + lineT + "\n" + str1 + end1 + "\n" + lineB;

            if (options.colors)
            {
                var color = 'black';
                if (options.title == '[ INFO ]')
                {
                    color = 'green';
                }
                if (options.title == '[ ERROR ]')
                {
                    color = 'red';
                }
                if (options.title == '[ NOTICE ]')
                {
                    color = 'blue';
                }
                if (options.color)
                {
                    if (options.color == 'red') color = 'red';
                    if (options.color == 'green') color = 'green';
                    if (options.color == 'yellow') color = 'yellow';
                    if (options.color == 'blue') color = 'blue';
                    if (options.color == 'magenta') color = 'magenta';
                    if (options.color == 'cyan') color = 'cyan';
                    if (options.color == 'white') color = 'white';
                }

                header = $clc[color](header);
                if (options.trace) stack = $clc[color](stack.trim());
            }

            console.log(header);

            if (options.trace && err) {
                console.log(stack);
            }

        }

        args.forEach(function(v) {
            $util.puts($util.inspect(v, options.showHidden, options.depth, options.colors));
        });
    }
};

__utils.Logger = function Logger(options)
{
    var optsError = __utils.clone(options); optsError.title = '[ ERROR ]'; optsError.trace = true;
    var optsNotice = __utils.clone(options); optsNotice.title = '[ NOTICE ]';
    var optsInfo = __utils.clone(options); optsInfo.title = '[ INFO ]';
    var optsAdd = __utils.clone(options); optsAdd.header = false;

    return {
        error: new __utils.Log(optsError),
        notice: new __utils.Log(optsNotice),
        info: new __utils.Log(optsInfo),
        add: new __utils.Log(optsAdd)
    };
};

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

__utils.isInstanceOf = isInstanceOf;
__utils.isTypeOf = isTypeOf;

__utils.isObject = isObject;
__utils.isArray = isArray;
__utils.isDate = isDate;
__utils.isError = isError;
__utils.isBoolean = __utils.isBool = isBoolean;
__utils.isFunction = isFunction;
__utils.isUndefined = isUndefined;
__utils.isNotUndefined = isNotUndefined;
__utils.hasKey = hasKey;
__utils.isInteger = __utils.isInt = isInteger;
__utils.isFloat = isFloat;
__utils.isNumber = isNumber;
__utils.isString = __utils.isStr = isString;
__utils.isRegExp = isRegExp;
__utils.isIP = isIP;
__utils.isIP4 = isIP4;
__utils.isIP6 = isIP6;
__utils.isUrl = isUrl;
__utils.isEmail = isEmail;

__utils.toBoolean = __utils.toBool = toBoolean;
__utils.toFloat = toFloat;
__utils.toInt = toInt;

__utils.rnd = rnd;