/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:49
 *
 * E = mc^2
 */

require('../../array');
var fields = require('../fields');

function EasyStructure(initial) {

    initial = initial || {};
    this.errors = [];

    var self = this;
    var fieldSet = Object.keys(this);

    fieldSet.forEach(function(fieldName) {

        if (self[fieldName] instanceof fields.Field)
        {
            var alias = self[fieldName]['options']['alias'];
            var value = initial[fieldName];

            if (typeof value === "undefined" && alias)
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
}

EasyStructure.prototype.isValid = function isValid() {

    return !this.errors.length;

};

EasyStructure.prototype.isNotValid = function isNotValid() {

    return !this.isValid();

};

EasyStructure.prototype.hasErrors = function hasErrors() {

    return !this.isValid();

};

EasyStructure.prototype.getErrors = function getErrors() {

    return this.errors || false;

};

EasyStructure.prototype.toObject = function toObject() {

    if (this.hasErrors()) return {};

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