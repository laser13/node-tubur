/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 24.03.13
 * Time: 17:57
 * To change this template use File | Settings | File Templates.
 */


var $util = require('util'),
    $validator = require('validator'),

    validator = new $validator.Validator(),
    filter = new $validator.Filter(),

    StringField = require('./string'),

    opt = require('./options'),

    __$__;

opt.key.EMAIL = 'email';
validator.error = function(msg)
{
    return false;
};



var EmailField = function()
{
    EmailField.super_.apply(this, arguments);

    EmailField.super_.prototype.setOption.call(this, 'email', 'msg', 'value must be Email');

};
$util.inherits(EmailField, StringField);


EmailField.prototype.check = function(value)
{
    value = EmailField.super_.prototype.check.call(this, value);

    if (value === undefined) return ;

    if ( !this._emailValidator(value) ) return ;

    return value;

};

EmailField.prototype._emailValidator = function(value)
{
    if ( !validator.check(value).isEmail() )
    {
        this._addValidationError(value, opt.key.EMAIL);
    }

    return true;
};

module.exports = EmailField;