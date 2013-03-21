/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 21.03.13
 * Time: 7:49
 *
 * E = mc^2
 */
require('../../array');
var __index = module.exports = exports,

    $util = require('util'),
    $validator = require('validator'),


    validator = new $validator.Validator(),
    filter = new $validator.Filter(),

    __$__;

var optionKeys = ['required', 'type', 'choices', 'min', 'max', 'range'],
    optionKeysRequired = ['required', 'type'],

    type = ['string', 'number'];


var Field = function(options)
{
    this.options = options || {
        required: { val: false, msg: '' },
        type: { val: 'string', instance: String, is_a: false, msg: '' }
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

    this.errors = [];

};

Field.prototype.sanitize = function(value, type)
{
    if (type == 'string')
    {
        return filter.sanitize(value).trim();
    }
    if (type == 'number')
    {
        return filter.sanitize(value).toInt();
    }
    if (type == 'boolean')
    {
        return filter.sanitize(value).toBoolean();
    }
    if (type == 'Date')
    {
        var date = new Date(value);
        if ($util.isDate(date)) return date;
    }

    return value;
};

Field.prototype._cookOptions = function()
{
    optionKeys.forEach(function(key) {

        if (this.options[key] !== undefined)
        {

        }
        else
        {
            if (optionKeysRequired.has(key))
            {

            }
        }

    });
};