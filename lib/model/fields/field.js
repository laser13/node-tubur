/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 21.03.13
 * Time: 7:49
 *
 * E = mc^2
 */
require('../../array');
var $util = require('util'),
    $validator = require('validator'),
    $underscore = require('underscore'),


    validator = new $validator.Validator(),
    filter = new $validator.Filter(),

    appError = require('../../error').app,

    opt = require('./options'),
//    EasyStructure = require('../structure/eazy'),

    __$__;

var defaultErrorMsg = opt.defaultErrorMsg,
    optionKeys = opt.optionKeys,
    baseTypes = opt.baseTypes,
    baseClass = opt.baseClass;


function Field()
{
    var args = Array.prototype.slice.call(arguments);

    this.errors = [];
    this.options = args.pop() || {

        required: optionKeys['required'].default,
        type: optionKeys['type'].default

    };

    if (args.length)
    {
        this.name = args[0];
        this._cookOptions();
    }

    this.isArray = false;
}

Field.prototype.setName = function(name)
{
    this.name = name;
    this._cookOptions();
};

Field.prototype.set = function(value)
{
    this.value = this.check(value);
};

Field.prototype.get = function()
{
    return this.value;
};

Field.prototype.getOptions = function()
{
    return this.options || {};
};

Field.prototype.getOption = function(optionName, key)
{
    return (this.options[optionName]) ? (typeof this.options[optionName][key] !== "undefined") ? this.options[optionName][key] : null : null;
};

Field.prototype.setOption = function(optionName, key, value)
{
    if (typeof this.options[optionName] === "undefined")
    {
        this.options[optionName] = optionKeys[optionName].default;
    }
    return this.options[optionName][key] = value;
};

Field.prototype.getOptionVal = function(optionName)
{
    return this.getOption.call(this, optionName, 'val');
};

Field.prototype.setOptionVal = function(optionName, value)
{
    return this.setOption.call(this, optionName, 'val', value);
};

Field.prototype.getOptionMsg = function(optionName, optionVal)
{
    var optionVal = optionVal || this.getOptionVal(optionName);
    if (typeof optionVal === "function") optionVal = optionVal.name;

    var msg = this.getOption(optionName, 'msg');
    return this._cookMsg(msg, optionVal);
};

Field.prototype._cookMsg = function(msg, optionVal)
{
    return msg.replace('%{option}', optionVal).replace('%{field}', this.name || '');
};

Field.prototype.isValid = function()
{
    return (this.errors.length) ? false : true;
};

Field.prototype.getErrors = function()
{
    return this.errors || false;
};

Field.prototype.check = function(value)
{
    var self = this,
        fieldType = this.getOptionVal('type');

    if ( typeof value === "undefined" && this.getOptionVal('default') !== null )
    {
        value = this.getOptionVal('default');
    }

    // Проверим на присутствие значения
    if ( !this._requiredValidator(value) ) return ;

    if (this.isArray)
    {
        // Если это не массив, то выдадим ошибку
        if ( !$underscore.isArray(value) )
        {
            this.errors.push( new appError.ValidationError({ field: this.name, value: value }, this._cookMsg(defaultErrorMsg.instance, 'Array') ));
            return ;
        }
    }

    // Нормализуем значения
    if ( !this.getOption('type', 'strict') )
    {
        if ( this.isArray )
        {
            value = value.map(function(item) { return self.sanitize(item, fieldType) });
        }
        else
        {
            value = this.sanitize(value, fieldType);
        }
    }

    if (baseTypes.indexOf(fieldType) != -1 && this.getOptionVal('instance') === null)
    {
        if ( !this._typeValidator(value) ) return ;
    }
    else if (baseClass.indexOf(fieldType) != -1)
    {
        if ( !this._instanceValidator(value) ) return ;
    }
    else if (typeof this.getOptionVal('instance') === "function")
    {
        if ( !this._eazyStructureValidator(value) ) return ;
    }

    if ( !self._minValidator(value) ) return ;
    if ( !self._maxValidator(value) ) return ;

    return value;

};

/**
 *  Если поле обязательное, а не пришло, то записываем ошибку
 *
 * @param {mixed} value
 * @param {boolean} required
 * @returns {boolean}
 * @private
 */
Field.prototype._requiredValidator = function(value)
{
    if ( this.getOptionVal('required') && typeof value === "undefined" )
    {
        this._addValidationError(value, 'required');
        return false;
    }

    if ( typeof value === "undefined" )
    {
        return false;
    }

    return true

};

Field.prototype._typeValidator = function(value)
{
    var fieldType = this.getOptionVal('type');

    if (this.isArray)
    {
        var self = this,
            error = false;
        value.forEach(function(item) {

            if (typeof item !== fieldType)
            {
                self._addValidationError(value, 'type', value.indexOf(item));
                error = true;
            }

        });

        if (error) return false;
    }
    else
    {
        if (typeof value !== fieldType)
        {
            this._addValidationError(value, 'type');
            return false;
        }
    }

    return true;
};

Field.prototype._instanceValidator = function(value)
{
    var self = this,
        fieldType = self.getOptionVal('type'),
        instance = null;

    if (fieldType === 'Date') instance = Date;
    if (fieldType === 'Array') instance = Array;
    if (fieldType === 'Buffer') instance = Buffer;

    if (instance === null)
    {

        return false;
    }

    if (this.isArray)
    {
        var self = this,
            error = false;

        value.forEach(function(item) {

            if ( !(item instanceof instance) )
            {
                self._addValidationError(value, 'type', value.indexOf(item));
                error = true;
            }

        });

        if (error) return false;
    }
    else
    {
        if ( !(value instanceof instance) )
        {
            this._addValidationError(value, 'type');
            return false;
        }
    }

    return true;
};

Field.prototype._eazyStructureValidator = function(value)
{
    var self = this,
        error = false,
        instance = self.getOptionVal('instance');

    if (this.isArray)
    {
        for (var i = 0, len = value.length; i < len; i++) {

            var item = value[i];

            if ( !(item instanceof instance) )
            {
                item = new instance(item);
            }

            if ( !item.isValid() )
            {
                var _err = item.getErrors();
                _err.map(function(v) {

                    v.info.field = self.name + '[' + i + ']' + '.' + v.info.field;

                });

                self.errors = self.errors.concat(_err);
                error = true;
            }

        }

    }
    else
    {
        if ( !(value instanceof instance) )
        {
            value = new instance(value);
        }

        if ( !value.isValid() )
        {
            var _err = value.getErrors();

            _err.map(function(item) {

                item.info.field = self.name + '.' + item.info.field;

            });

            self.errors = self.errors.concat(_err);
            error = true;
        }

    }

    if (error) return false;

    return true;
};

Field.prototype._choicesValidator = function(value) {};

Field.prototype._minValidator = function(value)
{
    var self = this,
        min = this.getOptionVal('min');

    if (min !== null)
    {
        if ( (typeof value === "string" || $underscore.isArray(value)) && value.length < min)
        {
            self._addValidationError(value, 'min');
            return false;
        }

        if (typeof value === "number" && value < min)
        {
            self._addValidationError(value, 'min');
            return false;
        }
    }

    return true;

};

Field.prototype._maxValidator = function(value)
{
    var
        self = this,
        max = (this.options['max']) ? parseInt(this.options['max'].val) : null;

    if (max !== null)
    {
        if (typeof value === "string" && value.length > max)
        {
            self.errors.push(new appError.ValidationError({ field: self.name, value: value }, self._cookMsg(self.options['max'].msg, max, self.name)));
            return false;
        }

        if (typeof value === "number" && value > max)
        {
            self.errors.push(new appError.ValidationError({ field: self.name, value: value }, self._cookMsg(self.options['max'].msg, max, self.name)));
            return false;
        }
    }

    return true;

};

Field.prototype._regexpValidator = function() {};

Field.prototype.sanitize = function(value, type)
{
    if (type == 'string' && ( typeof value === "string" || typeof value === "number"))
    {
        return filter.sanitize(value).trim();
    }
    if (type == 'number' && ( typeof value === "string" || typeof value === "number"))
    {
        var number = filter.sanitize(value).toInt();
        if (number !== NaN && number == value) return number;
    }
    if (type == 'boolean')
    {
        return filter.sanitize(value).toBoolean();
    }
    if (type == 'Date')
    {
        var date = new Date(value);
        if ($util.isDate(date) && date == value) return date;
    }

    return value;
};

Field.prototype._cookOptions = function()
{
    var self = this,
        keys = Object.keys(optionKeys);

    keys.forEach(function(key) {

        // Если опция существует
        if (typeof self.options[key] !== "undefined")
        {
            // Значение не является объектом
            if (typeof self.options[key] !== 'object' || Object.prototype.toString.call(self.options[key]) !== '[object Object]')
            {
                // Тогда преобразуем в нужный нам формат
                self.options[key] = { val: self.options[key], strict: false, msg: optionKeys[key].msg };
            }
            // Если объект в нужном формате, то проверим есть ли нужные ключи
            else
            {
                // Значения опции отсутствует
                if ( typeof self.options[key].val === "undefined" )
                {
                    // Если это обязательная опция, то создадим ошибку
                    if (optionKeys[key].required)
                    {
                        self.errors.push(new appError.SyntaxError({ option: key, value: self.options[key] }, 'incorrect format options'));
                    }
                    // Иначе просто удалим её
                    else
                    {
                        delete self.options[key];
                    }
                }

                // Сообщение отсутствует, возьмём его из заготовок
                if ( !self.options[key].msg )
                {
                    self.options[key].msg = optionKeys[key].msg;
                }

                if ( typeof self.options[key].strict === "undefined" )
                {
                    self.options[key].strict = false;
                }
            }
        }
        // Опции нет
        else
        {
            if (optionKeys[key].required)
            {
                if (optionKeys[key].default)
                {
                    self.options[key] = optionKeys[key].default;
                }
                else
                {
                    self.errors.push(new appError.SyntaxError({

                        option: key

                    }, 'required option'));
                }
            }
        }
    });

    /**
     * Проверяем тип поля, является ли он массивом
     */
    var fieldType = this.getOptionVal('type');

    if (fieldType.indexOf('[]') !== -1)
    {
        fieldType = fieldType.replace('[]', '');
        this.isArray = true;
        this.setOptionVal('type', fieldType);
    }

    if (baseClass.indexOf(fieldType) != -1)
    {
        this.setOption('type', 'msg', defaultErrorMsg.instance);
    }

};

Field.prototype._addValidationError = function(value, optionName, index)
{
    var fieldName = this.name;
    if (index >= 0)
    {
        fieldName += '[' + index + ']';
    }

    this.errors.push(new appError.ValidationError({ field: fieldName, value: value }, this.getOptionMsg(optionName)));
};


module.exports = Field;