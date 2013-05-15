/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 21.03.13
 * Time: 7:49
 *
 * E = mc^2
 */

var $util = require('util');
var utils = require('../../utils');
var terror = require('../../error');
var DateTime = require('../../datetime');
var opt = require('./options');

var defaultErrorMsg = opt.defaultErrorMsg;
var optionKeys = opt.optionKeys;
var baseTypes = opt.baseTypes;
var baseClass = opt.baseClass;

/**
 * @param {string} fieldName
 * @param {object} fieldOptions
 * @constructor
 */
function Field() {

    var args = Array.prototype.slice.call(arguments);

    this.errors = [];
    this.isArray = false;
    this.isCook = false;
    this.isCookOptions = false;

    var options = null;
    if (utils.isObject(args[args.length - 1])) {
        options = args.pop();
    }

    this.options = options || {
        required: optionKeys[opt.key.REQUIRED].default,
        type: optionKeys[opt.key.TYPE].default
    };

    // Смотрим было ли передано первым параметром имя поля
    if (args.length && args[0]) {
        this.name = ''+args[0];
        this._cookOptions();
    }
}

Field.prototype.setName = function setName(name) {
    this.name = name;
    this._cookOptions();
};

Field.prototype.set = function set(value) {
    if ( !this.isCookOptions ) this._cookOptions();
    this.value = this.check(value);
};

Field.prototype.get = function get() {
    return this.value;
};

Field.prototype.getOptions = function getOptions() {
    return this.options || {};
};

Field.prototype.getOption = function getOption(optionName, key) {
    return utils.hasKey(this.options, optionName, key) ? this.options[optionName][key] : null;
};

Field.prototype.setOption = function setOption(optionName, key, value) {

    if ( !utils.hasKey(this.options, optionName) ) {
        if ( utils.hasKey(optionKeys, optionName, opt.key.DEFAULT) ) {
            this.options[optionName] = optionKeys[optionName][opt.key.DEFAULT];
        }
        else {
            this.options[optionName] = { val: null, msg: '' };
        }
    }
    return this.options[optionName][key] = value;
};

Field.prototype.getOptionVal = function getOptionVal(optionName) {
    return this.getOption.call(this, optionName, 'val');
};

Field.prototype.setOptionVal = function setOptionVal(optionName, value) {
    return this.setOption.call(this, optionName, 'val', value);
};

Field.prototype.getOptionMsg = function getOptionMsg(optionName, optionVal) {
    optionVal = optionVal || this.getOptionVal(optionName);
    if ( utils.isFunction(optionVal) ) optionVal = optionVal.name;
    var msg = this.getOption(optionName, 'msg');
    return this._cookMsg(msg, optionVal);
};

Field.prototype._cookMsg = function _cookMsg(msg, optionVal) {
    return msg.replace('%{option}', optionVal).replace('%{field}', this.name || '');
};

Field.prototype.isValid = function isValid() {
    if (arguments.length) this.set.call(this, arguments[0]);
    return (this.errors.length || !this.isCook) ? false : true;
};

Field.prototype.getError = function getError() {
    if ( !this.isCook && !this.errors.length ) {
        throw new terror.SyntaxError(null, 'not called method "set"');
    }
//    this.errors.forEach(function(err) { console.log(err.name); });
    return new terror.MultiError(this.errors, 'Field validation errors');
};
Field.prototype.getErrors = Field.prototype.getError;

/**
 *
 * @param {*} value
 * @returns {*}
 */
Field.prototype.check = function check(value) {

    this.errors = [];
    this.isCook = true;

    var self = this;
    var fieldType = this.getOptionVal(opt.key.TYPE);

    if ( utils.isUndefined(value) && this.getOptionVal(opt.key.DEFAULT) !== null ) {
        value = this.getOptionVal(opt.key.DEFAULT);
    }

    // Проверим на присутствие значения
    if ( !this._requiredValidator(value) ) return ;

    if (this.isArray && !utils.isArray(value) && this.getOptionVal(opt.key.CORRECT)) {
        value = [value];
    }

    if (this.isArray) {
        // Если это не массив, то выдадим ошибку
        if ( !utils.isArray(value) ) {
            this.errors.push( new terror.ValidationError({ field: this.name, value: value }, this._cookMsg(defaultErrorMsg.instance, 'Array') ));
            return ;
        }
    }

    // Нормализуем значения
    if ( !this.getOption(opt.key.TYPE, 'strict') ) {
        if ( this.isArray ) {
            value = value.map(function(item) { return self.sanitize(item, fieldType) });
        }
        else {
            value = this.sanitize(value, fieldType);
        }
    }

    // Если значение должно быть простым типом
    if (baseTypes.indexOf(fieldType) != -1 && this.getOptionVal(opt.key.INSTANCE) === null) {
        if ( !this._typeValidator(value) ) return ;
    }

    // Если значение должно быть стандартным объектом [Array, Date, Buffer]
    else if (baseClass.indexOf(fieldType) != -1) {
        if ( !this._instanceValidator(value) ) return ;
    }

    // Если значение должно быть объектом класса EazyStructure
    else if ( utils.isFunction(this.getOptionVal(opt.key.INSTANCE)) ) {
        var easyStruc = this._eazyStructureValidator(value);
        if ( !easyStruc.valid ) return ;
        else value = easyStruc.value;
    }

    if ( !self._minValidator(value) ) return ;
    if ( !self._maxValidator(value) ) return ;
    if ( !self._choicesValidator(value) ) return ;
    if ( !self._regexpValidator(value) ) return ;

    return value;

};

Field.prototype.sanitize = function sanitize(value, type) {

    if (type == 'string' && ( utils.isString(value) || utils.isNumber(value) ) ) {
        return value.toString().trim();
    }
    if (type == 'number' && ( utils.isString(value) || utils.isNumber(value) ) ) {
        var number = utils.toInt(value);
        if (number !== NaN && number == value) return number;
    }
    if (type == 'boolean') {
        return utils.toBoolean(value);
    }
    if (type == 'Date') {
        var date = new Date(value);
        if (utils.isDate(date)) return date;
    }
    return value;
};

/**
 *  Если поле обязательное, а не пришло, то записываем ошибку
 *
 * @param {*} value
 * @returns {boolean}
 * @private
 */
Field.prototype._requiredValidator = function(value) {
    if ( this.getOptionVal(opt.key.REQUIRED) && utils.isUndefined(value) ) {
        this._addValidationError(value, opt.key.REQUIRED);
        return false;
    }
    return (utils.isNotUndefined(value));
};

/**
 * Проверяем на соответствие типа
 *
 * @param {*} value
 * @returns {boolean}
 * @private
 */
Field.prototype._typeValidator = function(value) {

    var fieldType = this.getOptionVal(opt.key.TYPE);
    var checkType = function(val) { return utils.isTypeOf(val, fieldType) };
    if (fieldType == 'object') {
        checkType = function(val) { return utils.isObject(val) };
    }

    if (this.isArray) {
        var self = this;
        var error = false;
        value.forEach(function(item) {
            if (!checkType(item)) {
                self._addValidationError(item, opt.key.TYPE, value.indexOf(item));
                error = true;
            }
        });
        if (error) return false;
    }
    else {
        if (!checkType(value)) {
            this._addValidationError(value, opt.key.TYPE);
            return false;
        }
    }
    return true;
};

/**
 * Проверяем принадлежность к определённому классу
 *
 * @param {*} value
 * @returns {boolean}
 * @private
 */
Field.prototype._instanceValidator = function(value) {
    var self = this;
    var fieldType = self.getOptionVal(opt.key.TYPE);
    var Instance = null;

    if (fieldType === 'Date') Instance = Date;
    if (fieldType === 'Array') Instance = Array;
    if (fieldType === 'Buffer') Instance = Buffer;

    if (Instance === null) {
        return false;
    }

    if (this.isArray) {
        var error = false;
        value.forEach(function(item) {
            if ( !utils.isInstanceOf(item, Instance) ) {
                self._addValidationError(item, opt.key.TYPE, value.indexOf(item));
                error = true;
            }
        });
        if (error) return false;
    }
    else {
        if ( !utils.isInstanceOf(value, Instance) ) {
            this._addValidationError(value, opt.key.TYPE);
            return false;
        }
    }
    return true;
};

Field.prototype._eazyStructureValidator = function(value) {

    var self = this;
    var error = false;
    var val = null;
    var Instance = self.getOptionVal(opt.key.INSTANCE);

    if (this.isArray) {
        val = [];
        for (var i = 0, len = value.length; i < len; i++) {

            var item = value[i];
            if ( !utils.isInstanceOf(item, Instance) ) {
                item = new Instance(item);
            }

            if ( !item.isValid() ) {
                var errs = [];
                var err = item.getError();
                if (utils.isMultiError(err)) errs = err.getErrors();
                errs.map(function(v) {
                    v.info.field = self.name + '[' + i + ']' + '.' + v.info.field;
                });
                self.errors = self.errors.concat(errs);
                error = true;
            }
            else {
                val.push(item.toObject());
            }
        }
    }
    else {
        if ( !utils.isInstanceOf(value, Instance) ) {
            value = new Instance(value);
        }

        if ( !value.isValid() ) {
            var errs = [];
            var err = value.getError();
            if (utils.isMultiError(err)) errs = err.getErrors();
            errs.map(function(item) {
                item.info.field = self.name + '.' + item.info.field;
            });
            self.errors = self.errors.concat(errs);
            error = true;
        }
        else {
            val = value.toObject();
        }
    }
    return { valid: !error, value: val };
};

Field.prototype._choicesValidator = function(value) {

    var self = this;
    var choices = this.getOptionVal(opt.key.CHOICES);

    if (choices && utils.isArray(choices)) {
        var error = true;

        if (this.isArray) {
            value.forEach(function(item) {
                var err1 = true;
                choices.forEach(function(choice) {
                    if (choice == item) err1 = false;
                });
                if (err1) {
                    self._addValidationError(item, opt.key.CHOICES, value.indexOf(item));
                }
                error = err1;
            });
            if (error) return false;
        }
        else {
            choices.forEach(function(choice) {
                if (choice == value) error = false;
            });
        }

        if (error) {
            self._addValidationError(value, opt.key.CHOICES);
            return false;
        }
    }
    return true;
};

Field.prototype._minValidator = function(value) {

    var self = this;
    var min = this.getOptionVal(opt.key.MIN);

    if (min !== null) {

        if ( ( utils.isString(value) || utils.isArray(value) ) && value.length < min ) {
            self._addValidationError(value, opt.key.MIN);
            return false;
        }

        if (utils.isNumber(value) && value < min) {
            self._addValidationError(value, opt.key.MIN);
            return false;
        }

        if (utils.isDate(value)) {
            var dt = new DateTime(value);
            if (dt.diff(min) > 0) {
                self._addValidationError(value, opt.key.MIN);
                return false;
            }
        }
    }
    return true;
};

Field.prototype._maxValidator = function(value) {

    var self = this;
    var max = this.getOptionVal(opt.key.MAX);

    if (max !== null) {
        if ( ( utils.isString(value) || utils.isArray(value) ) && value.length > max ) {
            self._addValidationError(value, opt.key.MAX);
            return false;
        }

        if (utils.isNumber(value) && value > max) {
            self._addValidationError(value, opt.key.MAX);
            return false;
        }

        if (utils.isDate(value)) {
            var dt = new DateTime(value);
            if (dt.diff(max) > 0) {
                self._addValidationError(value, opt.key.MAX);
                return false;
            }
        }
    }
    return true;
};

Field.prototype._regexpValidator = function() {
    return true;
};

Field.prototype._cookOptions = function() {

    var self = this;
    var keys = Object.keys(optionKeys);

    keys.forEach(function(key) {
        // Если опция существует
        if ( utils.hasKey(self.options, key) ) {
            // Значение не является объектом
            if ( !utils.isObject(self.options[key]) ) {
                // Тогда преобразуем в нужный нам формат
                self.options[key] = { val: self.options[key], strict: false, msg: optionKeys[key].msg };
            }
            // Если объект в нужном формате, то проверим есть ли нужные ключи
            else if (key === opt.key.DEFAULT) {
                self.options[key] = { val: self.options[key], msg: '' };
            }
            else {
                // Значения опции отсутствует
                if ( !utils.hasKey(self.options[key], 'val') ) {
                    // Если это обязательная опция, то создадим ошибку
                    if (optionKeys[key].required) {
                        throw new terror.SyntaxError({ option: key, value: self.options[key] }, 'incorrect format options');
                    }
                    // Иначе просто удалим её
                    else {
                        delete self.options[key];
                    }
                }

                // Сообщение отсутствует, возьмём его из заготовок
                if ( !utils.hasKey(self.options[key], 'msg') ) {
                    self.options[key].msg = optionKeys[key].msg;
                }

                if ( !utils.hasKey(self.options[key], 'strict') ) {
                    self.options[key].strict = false;
                }
            }
        }
        // Опции нет
        else {
            if (optionKeys[key].required) {
                if (optionKeys[key].default) {
                    self.options[key] = optionKeys[key].default;
                }
                else {
                    throw new terror.SyntaxError({ option: key }, 'required option');
                }
            }
        }
    });

    /**
     * Проверяем тип поля, является ли он массивом
     */
    var fieldType = this.getOptionVal(opt.key.TYPE);

    if (fieldType.indexOf('[]') !== -1) {
        fieldType = fieldType.replace('[]', '');
        this.isArray = true;
        this.setOptionVal(opt.key.TYPE, fieldType);
    }

    if (baseClass.indexOf(fieldType) != -1) {
        this.setOption(opt.key.TYPE, 'msg', defaultErrorMsg.instance);
    }

    this.isCookOptions = true;
};

Field.prototype._addValidationError = function(value, optionName, index) {
    var fieldName = this.name;
    if (index >= 0) {
        fieldName += '[' + index + ']';
    }
    this.errors.push(new terror.ValidationError({ field: fieldName, value: value }, this.getOptionMsg(optionName)));
};

module.exports = Field;