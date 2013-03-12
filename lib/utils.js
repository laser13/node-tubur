/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 19.02.13
 * Time: 8:29
 *
 * E = mc^2
 */

var __utils = module.exports = exports,

    _util = require('util'),

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
    console.log("\n");
    _util.log("\n============================================");
    var args = Array.prototype.slice.call(arguments),
        depth = 2;

    if (args.length > 1)
    {
        var _depth = args[args.length - 1];

        if ( (typeof _depth === "number") && _depth >= 0) {
            depth = args.pop();
        }

    }

    args.forEach(function(v) {
        _util.puts(_util.inspect(v, true, depth, true));
    });
};