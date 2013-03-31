/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:49
 *
 * E = mc^2
 */

require('../../array');
var fields = require('../fields'),

    __$__;

var EasyStructure = function(initial)
{
    this.errors = [];

    var self = this,
        fieldSet = Object.keys(this);

    fieldSet.forEach(function(fieldName) {

        if (self[fieldName] instanceof fields.Field)
        {
            var alias = self[fieldName].getOptionVal('alias');
            var value = initial[fieldName];

            if (alias)
            {
                value = initial[alias];
            }

            self[fieldName].setName(fieldName);
            self[fieldName].set(value);

            if ( !self[fieldName].isValid() )
            {
                self.errors = self.errors.concat(self[fieldName].getErrors());
            }

        }

    });
};

EasyStructure.prototype.isValid = function() {

    if (arguments.length) this.set.call(this, arguments[0]);

    if (this.errors !== undefined && this.errors.length) return false;
    return true;

};

EasyStructure.prototype.getErrors = function() {

    return this.errors || false;

};

EasyStructure.prototype.toObject = function() {

    if ( !this.isValid() ) return {};

    function check(item)
    {
        if (item instanceof EasyStructure)
        {
            return item.toObject();
        }
        return item.get();
    }

    var self = this,
        fieldSet = Object.keys(this),
        obj = {};

    fieldSet.forEach(function(key) {

        if (self[key] instanceof fields.Field && self[key].value !== undefined) {

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

module.exports = EasyStructure;