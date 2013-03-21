/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 21.03.13
 * Time: 7:49
 *
 * E = mc^2
 */

var __index = module.exports = exports,

    util = require('util'),

    __$__;


var Field = function(options)
{
    this.options = options || {
        required: { val: false, msg: '' },
        type: { val: 'string', msg: '' }
    };
};

Field.prototype.set = function(value)
{
    this.value = this.verify(value);
};

Field.prototype.get = function()
{
    return this.value;
};

Field.prototype.verify = function(value)
{

};