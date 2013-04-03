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

    options.title = options.title || '';

    return function()
    {
        console.log("\n========================================================================================================================");
        $util.log(options.title + "\n========================================================================================================================");
        var args = Array.prototype.slice.call(arguments),
            depth = 3,
            color = true;

        if (args.length > 1)
        {
            var last = args[args.length - 1];

            if ( typeof last === "object" && typeof last.depth !== "undefined") {
                options.depth = last.depth;
                args.pop();
            }

        }

        args.forEach(function(v) {
            $util.puts($util.inspect(v, options.showHidden, options.depth, options.colors));
        });
    }
};