/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 14.04.13 17:31
 *
 * E = mc^2
 */

var __datetime = module.exports = exports,

    $util = require('util'),

    __$__;


function Datetime()
{
    var args = Array.prototype.slice.call(arguments);

    this.date = (args[0]) ? new Date(args[0]).getTime() : Date.now();

}

Datetime.prototype.move = function move(time)
{};

module.exports = Datetime;