/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */


var $util = require('util'),

    NumberField = require('./number'),

    opt = require('./options'),

    optionKeys = opt.optionKeys,

    __$__;



var PositiveNumberField = function()
{
    var args = Array.prototype.slice.call(arguments),
        name = null,
        options = args.pop() || {
            required: optionKeys['required'].default
        };

    options['min'] = { val: 0 };

    if (args.length)
    {
        this.name = args[0];
    }

    PositiveNumberField.super_.call(this, name, options);

};
$util.inherits(PositiveNumberField, NumberField);

module.exports = PositiveNumberField;