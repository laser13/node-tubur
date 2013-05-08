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
var terror = require('../../error');

function EasyStructure(initial) {

    initial = initial || {};
    this.errors = [];

    var self = this;
    if (initial) this._validate(initial);
}

EasyStructure.prototype.addField = function addField(fieldName, options) {
    this[fieldName] = new fields.Field(options);
    return this;
};

EasyStructure.prototype.isValid = function isValid(initial) {
    if (initial) this._validate(initial);
    return !this.errors.length;
};

EasyStructure.prototype.isNotValid = function isNotValid() {
    return !this.isValid();
};

EasyStructure.prototype.hasErrors = function hasErrors() {
    return !this.isValid();
};

EasyStructure.prototype.getErrors = function getErrors() {
    return this.getError();
};

EasyStructure.prototype.getError = function getError() {
    var multiError = false;
    if (this.errors.length) multiError = new terror.MultiError(this.errors, 'EasyStructureError');
    return multiError;
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

EasyStructure.prototype._validate = function _validate(initial) {

    var self = this;
    var fieldSet = Object.keys(this);

    fieldSet.forEach(function(fieldName) {

        if (self[fieldName] instanceof fields.Field) {
            var alias = self[fieldName]['options']['alias'];
            var value = initial[fieldName];

            if (typeof value === "undefined" && alias) {
                value = initial[alias];
            }

            self[fieldName].setName(fieldName);
            self[fieldName].set(value);

            if ( !self[fieldName].isValid() ) {
                self.errors = self.errors.concat(self[fieldName].getErrors());
            }
        }
    });
};

module.exports = EasyStructure;