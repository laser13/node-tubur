/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */


var $util = require('util'),

    Field = require('./field'),

    opt = require('./options'),

    optionKeys = opt.optionKeys,

    __$__;



var StringField = function()
{
    var args = Array.prototype.slice.call(arguments),
        name = null,
        options = args.pop() || {
            required: optionKeys['required'].default
        };

    if (options['type'] == 'Array' || options['type'] == 'string[]')
    {
        options['type'] = { val: 'string[]' };
    }
    else
    {
        options['type'] = { val: 'string' };
    }

    if (args.length)
    {
        this.name = args[0];
    }

    StringField.super_.call(this, name, options);

};
$util.inherits(StringField, Field);

module.exports = StringField;