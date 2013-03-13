/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 08.03.13 --- 22:37
 *
 * E = mc^2
 */

require('./array');
var _serializer = require('serializer');

var Wait = function(items, log)
{
    var self = this;

    this.log = log || false;

    this.items = items || [];
    this.stopKey = _serializer.randomString(64);

    this.condition = function()
    {
        return (self.items.length == 0);
    }

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

    (function loop(){

        setTimeout(function() {

            if (self.condition == self.stopKey) return ;

            if (self.log) console.log(self.log, self.condition(), new Date().getTime());

            if ( !(self.condition()) ) return setTimeout(loop, interval);

            callback();

        }, 0);

    })();
};

module.exports = Wait;