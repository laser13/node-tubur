/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */


var $util = require('util'),
    utils = require('../../utils'),

    StringField = require('./string'),

    opt = require('./options'),

    __$__;

opt.key.EMAIL = 'email';

var EmailField = function()
{
    EmailField.super_.apply(this, arguments);

    EmailField.super_.prototype.setOption.call(this, 'email', 'msg', 'value must be Email');

};
$util.inherits(EmailField, StringField);


EmailField.prototype.check = function(value)
{
    value = EmailField.super_.prototype.check.call(this, value);

    if (utils.isUndefined(value)) return ;

    if ( !this._emailValidator(value) ) return ;

    return value;

};

EmailField.prototype._emailValidator = function(value)
{
    if ( !utils.isEmail(value) )
    {
        this._addValidationError(value, opt.key.EMAIL);
    }

    return true;
};

module.exports = EmailField;