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


function DateField() {

    var args = Array.prototype.slice.call(arguments);
    var name = null;
    var options = args.pop() || { required: optionKeys['required'].default };

    if (options['type'] == 'Array' || options['type'] == 'Date[]') {
        options['type'] = { val: 'Date[]' };
    }
    else {
        options['type'] = { val: 'Date' };
    }

    if (args.length) {
        this.name = args[0];
    }
    DateField.super_.call(this, name, options);
}
$util.inherits(DateField, Field);

module.exports = DateField;