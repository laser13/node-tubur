/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */

var $util = require('util');
var utils = require('../../utils');
var StrField = require('./index').StrField;
var opt = require('./options');

opt.key.EMAIL = 'email';

var EmailField = function() {
    EmailField.super_.apply(this, arguments);
    EmailField.super_.prototype.setOption.call(this, 'email', 'msg', 'value must be Email');
};
$util.inherits(EmailField, StrField);


EmailField.prototype.check = function(value) {
    value = EmailField.super_.prototype.check.call(this, value);
    if (utils.isUndefined(value)) return ;
    if ( !this._emailValidator(value) ) return ;
    return value;
};

EmailField.prototype._emailValidator = function(value) {

    var self = this;
    if (this.isArray) {

        var error = false;
        value.forEach(function(item) {
            if ( !utils.isEmail(item) ) {
                self._addValidationError(item, opt.key.EMAIL, value.indexOf(item));
                error = true;
            }
        });
        if (error) return false;
    }
    else {
        if ( !utils.isEmail(value) ) {
            self._addValidationError(value, opt.key.EMAIL);
            return false;
        }
    }
    return true;
};

module.exports = EmailField;