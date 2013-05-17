/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */

var $util = require('util');
var utils = require('../../utils');
var Field = require('./field');
var opt = require('./options');
var optionKeys = opt.optionKeys;



var StringField = function() {

    var args = Array.prototype.slice.call(arguments);
    var options = null;

    if (args.length) {

        var first = args[0];
        var second = args[1];

        // Если первый параметр это строка, то надо так понимать это имя поля
        if ( utils.isString(first) ) {
            this.name = first;
            if ( utils.isObject(second) && utils.isSet(second) ) {
                options = second;
            }
        }
        // Если первый параметр это object, то надо так понимать это свойства поля
        else if (utils.isObject(first)) {
            options = first;
        }
    }

    options = options || { required: optionKeys['required'].default };
    if (options['type'] == 'Array' || options['type'] == 'string[]')
        options['type'] = { val: 'string[]' };
    else
        options['type'] = { val: 'string' };

    StringField.super_.call(this, options);
};
$util.inherits(StringField, Field);

module.exports = StringField;