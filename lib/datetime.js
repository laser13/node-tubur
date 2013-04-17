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

    this.date = (args[0]) ? new Date(args[0]) : new Date();

    this.SECOND = 1000;
    this.MINUTE = 60 * this.SECOND;
    this.HOUR = 60 * this.MINUTE;
    this.DAY = 24 * this.HOUR;
    this.WEEK = 7 * this.DAY;
    this.DECADE = 10 * this.DAY;

}

Datetime.prototype.move = function move(value, dimension)
{
    var multiplier = 0;
    if (dimension == 'decade' || dimension == 'decades') multiplier = this.DECADE;
    if (dimension == 'week' || dimension == 'weeks') multiplier = this.WEEK;
    if (dimension == 'day' || dimension == 'days') multiplier = this.DAY;
    if (dimension == 'hour' || dimension == 'hours') multiplier = this.HOUR;
    if (dimension == 'minute' || dimension == 'minutes') multiplier = this.MINUTE;

    return new Date(this.date.getTime() + (value * multiplier));

};

Datetime.prototype.get = function move()
{
    return this.date;
};

module.exports = Datetime;