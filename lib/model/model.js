/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:49
 *
 * E = mc^2
 */

require('../array');
var $util = require('util'),

    $validator = require('validator'),
    validator = new $validator.Validator(),
    filter = new $validator.Filter(),

    Field = require('./fields/field'),

    appError = require('../error').app,

    __$__;

var EasyModel = function(initial)
{
    this.errors = [];

    var self = this,
        fields = Object.keys(this);

    fields.forEach(function(key) {

        if (self[key] instanceof Field)
        {
            self[key].setName(key);
            self[key].set(initial[key]);

            if ( !self[key].isValid() )
            {
                self.errors = self.errors.concat(self[key].getErrors());
            }

        }

    });
};

EasyModel.prototype.isValid = function() {

    if (this.errors !== undefined && this.errors.length) return false;
    return true;

};

EasyModel.prototype.getErrors = function() {

    return this.errors || false;

};

EasyModel.prototype.toObject = function() {

    if ( !this.isValid() ) return {};

    function check(item)
    {
        if (typeof item === 'object' && item['toObject'] !== undefined)
        {
            return item.toObject();
        }
        return item.get();
    }

    var self = this,
        fields = Object.keys(this),
        obj = {};

    fields.forEach(function(key) {

        if (self[key] !== undefined && self[key] instanceof Field) {

            if (self[key] instanceof Array)
            {
                obj[key] = self[key].map(function(item) { return check(item) });
            }
            else
            {
                obj[key] = check(self[key]);
            }
        }
    });

    return obj;
};

module.exports = EasyModel;