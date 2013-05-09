/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */

var $util = require('util');
var Field = require('./field');
var opt = require('./options');
var optionKeys = opt.optionKeys;


var NumberField = function() {

    var args = Array.prototype.slice.call(arguments);
    var name = null;
    var options = args.pop() || { required: optionKeys['required'].default };

    if (options['type'] == 'Array' || options['type'] == 'number[]') {
        options['type'] = { val: 'number[]' };
    }
    else {
        options['type'] = { val: 'number' };
    }

    if (args.length) {
        this.name = args[0];
    }
    NumberField.super_.call(this, name, options);
};
$util.inherits(NumberField, Field);

module.exports = NumberField;