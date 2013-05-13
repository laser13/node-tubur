/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:49
 *
 * E = mc^2
 */

var fields = require('../fields');
var terror = require('../../error');
var utils = require('../../utils');

function EasyStructure(initial) {

    this.errors = [];
    this.isChecked = false;

    var self = this;
    if (initial) {
        this._validate(initial);
    }
}

EasyStructure.prototype.addField = function addField(fieldName, options) {

    var args = Array.prototype.slice.call(arguments);

    // Если передали два параметра, то первым должено быть имя поля
    // а вторым его опции
    if (args.length === 2) {
        if ( !utils.isString(args[0]) ) throw new terror.SyntaxError({ argument: 'fieldName', value: args[0] }, 'first argument must be a String');
        if ( !utils.isObject(args[1]) ) throw new terror.SyntaxError({ argument: 'fieldOptions', value: args[1] }, 'second argument must be a Object');
        this[args[0]] = new fields.Field(args[1]);
    }
    else if (args.length === 1) {
        if ( !utils.isInstanceOf(args[0], fields.Field) ) throw new terror.SyntaxError({ argument: 'field', value: args[0] }, 'argument should be an instance of Field');
        this[args[0].name] = args[0];
    }
    else {
        throw new terror.SyntaxError(null, 'for the method addField requires one or two arguments');
    }

    return this;
};

EasyStructure.prototype.isValid = function isValid(initial) {
    if ( !this.isChecked ) this._validate(initial);
    return !this.errors.length;
};

EasyStructure.prototype.hasError = function hasError() {
    return !this.isValid();
};

EasyStructure.prototype.getError = function getError() {
    var multiError = false;
    if (this.errors.length) multiError = new terror.MultiError(this.errors, 'EasyStructureError');
    return multiError;
};

EasyStructure.prototype.toObject = function toObject() {

    if (this.errors.length) return {};

    function check(item) {
        if (item instanceof EasyStructure) {
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

    initial = initial || {};

    fieldSet.forEach(function(fieldName) {

        if (self[fieldName] instanceof fields.Field) {
            var alias = self[fieldName]['options']['alias'];
            var value = initial[fieldName];

            if (alias && !utils.isArray(alias)) alias = [alias];

            if (typeof value === "undefined" && alias) {
                alias.forEach(function(item) { if (item in initial) value = initial[item]; });
            }

            self[fieldName].setName(fieldName);
            self[fieldName].set(value);

            if ( !self[fieldName].isValid() ) {
                self.errors = self.errors.concat(self[fieldName].getError().getErrors());
            }
        }
    });
    this.isChecked = true;
};

module.exports = EasyStructure;