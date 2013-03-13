/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 08.03.13 --- 22:37
 *
 * E = mc^2
 */
var _serializer = require('serializer');

var Wait = function(items)
{
    var self = this;

    this.items = items || [];
    this.stopKey = _serializer.randomString(64);

    this.condition = function()
    {
        return (self.items.length == 0);
    }

};

Wait.prototype.change = function(value)
{
    this.condition = value;
};

Wait.prototype.stop = function()
{
    this.condition = this.stopKey;
};

Wait.prototype.add = function(key)
{
    key = key || _serializer.randomString(64);
    this.items.push(key);
    return key;
};

Wait.prototype.ok = function(key)
{
    this.items.remove(key);
};

Wait.prototype.run = function(interval, callback)
{
    var self = this;
    var flag = "boolean";
    if (typeof this.condition === "function") flag = "function";

    (function loop(){

        setTimeout(function() {

            if (self.condition == self.stopKey) return ;

            if (flag == "boolean")
            {
//                console.log("boolean", self.condition, new Date().getTime());
                if ( !self.condition ) return setTimeout(loop, interval);
            }
            if (flag == "function")
            {
//                console.log("function", self.condition(), new Date().getTime());
                if ( !(self.condition()) ) return setTimeout(loop, interval);
            }

            callback();

        }, 0);

    })();
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = Wait;