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


function leadingZero(val) { return (val < 10) ? ('0' + val) : val; }

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

Datetime.prototype.diff = function diff(date, dimension)
{
    var diff = this.date.getTime() - new Date(date).getTime();
    var divisor = this.DAY;
    if (dimension == 'decade' || dimension == 'decades') divisor = this.DECADE;
    if (dimension == 'week' || dimension == 'weeks') divisor = this.WEEK;
    if (dimension == 'day' || dimension == 'days') divisor = this.DAY;
    if (dimension == 'hour' || dimension == 'hours') divisor = this.HOUR;
    if (dimension == 'minute' || dimension == 'minutes') divisor = this.MINUTE;

    return parseInt(diff / divisor);

};

/**
 * https://docs.djangoproject.com/en/dev/ref/templates/builtins/#date
 * @param {String} format
 * @returns {String}
 */
Datetime.prototype.format = function format(format)
{
    var d = this.date.getDate();
    var m = this.date.getMonth() + 1;
    var Y = this.date.getFullYear();
    var H = this.date.getHours();
    var i = this.date.getMinutes();
    var s = this.date.getSeconds();
    var u = this.date.getMilliseconds();

    return format
        .replace(new RegExp("%Y",'g'), Y)
        .replace(new RegExp("%y",'g'), Y.toString().substr(2,2))
        .replace(new RegExp("%m",'g'), leadingZero(m))
        .replace(new RegExp("%d",'g'), leadingZero(d))
        .replace(new RegExp("%H",'g'), leadingZero(H))
        .replace(new RegExp("%i",'g'), leadingZero(i))
        .replace(new RegExp("%s",'g'), leadingZero(s))
        .replace(new RegExp("%u",'g'), u)
        ;

};

module.exports = Datetime;