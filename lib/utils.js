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

            }

        }

        if (options.trace)
        {
            err = new Error;
            err.name = 'Trace';
            err.message = 'Error';
            Error.captureStackTrace(err, arguments.callee);
            stack = err.stack;
            stack = stack.split("\n");
            stack = stack[1];
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

__utils.Logger = function(options)
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