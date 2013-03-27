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


    validator = new $validator.Validator(),
    filter = new $validator.Filter(),

    appError = require('../../error').app,

    opt = require('./index'),

    __$__;

var optionKeys = opt.optionKeys,
    baseTypes = opt.baseTypes,
    baseClass = opt.baseClass;


var Field = function()
{
    var args = Array.prototype.slice.call(arguments);

    this.options = args.pop() || {

        required: optionKeys['required'].default,
        type: optionKeys['type'].default

    };

    if (args.length)
    {
        this.name = args[0];
    }
};

Field.prototype.set = function(value)
{
    this.value = this.verify(value);
};

Field.prototype.get = function()
{
    return this.value;
};

Field.prototype.isValid = function()
{
    return (this.errors.length) ? false : true;
};

Field.prototype.getErrors = function()
{
    return this.errors || false;
};

Field.prototype.setName = function(name)
{
    this.name = name;
};

Field.prototype.verify = function(value)
{
    this.errors = [];

    this._cookOptions();

    var self = this,
        klass = null,

        keys = Object.keys(optionKeys),

        isArray = false,
        fieldName = this.name,
        fieldType = this.options['type'].val,
        typeStrict = this.options['type'].strict,
        required = filter.sanitize(this.options['required'].val).toBoolean(),

        instance = self.options['instance'] || null,

        msg = {},

        __$__;

    if ( !required && value === undefined ) {

        if (this.options['default'] !== undefined)
        {
            return this.options['default'].val;
        }
        else
        {
            return value;
        }
    }

    keys.forEach(function(key) {

        msg[key] = (self.options[key]) ? self.options[key].msg || optionKeys[key].msg : optionKeys[key].msg;

    });

    /**
     * Если поле обязательное, а не пришло, то записываем ошибку
     */
    if ( required && value === undefined )
    {
        this.errors.push(new appError.ValidationError({ field: fieldName, value: value }, self._cookMsg(msg['required'], null, fieldName)));
        return ;
    }

    /**
     * Проверяем тип поля, является ли он массивом
     */
    if (fieldType.indexOf('[]') !== -1 || fieldType == 'Array')
    {
        fieldType = fieldType.replace('[]', '');
        isArray = true;

        // Если это не массив, то выдадим ошибку
        if ( !$util.isArray(value) )
        {
            this.errors.push(new appError.ValidationError({ field: fieldName, value: value }, self._cookMsg(msg['type'], 'Array', fieldName)));
            return ;
        }

    }

    /**
     * Значение поля пришло
     */

    // Нормализуем его
    if ( !typeStrict )
    {
        if ( !isArray )
        {
            value = this.sanitize(value, fieldType);
        }
        else
        {
            value = value.map(function(item) { return self.sanitize(item, fieldType) });
        }
    }

//    dump(fieldName, fieldType, instance, 0);

    // Значение должно быть простым типом
    if (baseTypes.has(fieldType) && !instance)
    {
        var error = false;
        
        if (isArray)
        {
            value.forEach(function(item) {

                if (typeof item !== fieldType)
                {
                    self.errors.push(new appError.ValidationError({ field: fieldName+'['+value.indexOf(item)+']', value: item }, self._cookMsg(msg['type'], fieldType, fieldName)));
                    error = true;
                }

            });
        }
        else
        {
            if (typeof value !== fieldType)
            {
                this.errors.push(new appError.ValidationError({ field: fieldName, value: value }, self._cookMsg(msg['type'], fieldType, fieldName)));
                error = true;
            }
        }

        if (error) return ;

    }
    // Значение является объектом стандартного класса
    else if (baseClass.has(fieldType) && !instance)
    {
        var error = false;

        if (typeof instance === "function")
        {
            klass = instance;
        }
        else
        {
            klass = eval(fieldType);
        }

        if (isArray)
        {
            value.forEach(function(item) {

                if ( !(item instanceof klass) )
                {
                    self.errors.push(new appError.ValidationError({ field: fieldName+'['+value.indexOf(item)+']', value: item }, self._cookMsg(msg['instance'], fieldType, fieldName)));
                    error = true;
                }
            });
        }
        else
        {
            if ( !(value instanceof klass) )
            {
                self.errors.push(new appError.ValidationError({ field: fieldName, value: value }, self._cookMsg(msg['instance'], fieldType, fieldName)));
                error = true;
            }
        }

        if (error) return ;
    }
    // Значение является объектом пользовательского класса
    else
    {
        var error = false;

        if (typeof instance.val === "function")
        {
            klass = instance.val;
        }
        else
        {
            klass = eval(fieldType);
        }

        if (isArray)
        {
            var i = 0;
            for (var i = 0, len = value.length; i < len; i++) {

                var item = value[i];

                if ( !(item instanceof klass) )
                {
                    item = new klass(item);
                }

                if ( !item.isValid() )
                {
                    var _err = item.getErrors();
                    _err.map(function(v) {

                        v.info.field = fieldName + '[' + i + ']' + '.' + v.info.field;

                    });


                    self.errors = self.errors.concat(_err);
                    error = true;
                }

            }

        }
        else
        {
            if ( !(value instanceof klass) )
            {
                value = new klass(value);
            }

            if ( !value.isValid() )
            {

                var _err = value.getErrors();

                _err.map(function(item) {

                    item.info.field = fieldName + '.' + item.info.field;

                });

                self.errors = self.errors.concat(_err);
                error = true;
            }

        }

        if (error) return ;
    }

    if ( !self._minValidator(value) ) return ;
    if ( !self._maxValidator(value) ) return ;

    return value;

};

Field.prototype._minValidator = function(value)
{
    var
        self = this,
        min = (this.options['min']) ? parseInt(this.options['min'].val) : null;

    if (min !== null)
    {
        if (typeof value === "string" && value.length < min)
        {
            self.errors.push(new appError.ValidationError({ field: self.name, value: value }, self._cookMsg(self.options['min'].msg, min, self.name)));
            return false;
        }

        if (typeof value === "number" && value < min)
        {
            self.errors.push(new appError.ValidationError({ field: self.name, value: value }, self._cookMsg(self.options['min'].msg, min, self.name)));
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

Field.prototype._regexpValidator = function() {
};

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
            if (typeof self.options[key] !== "object")
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
                    self.errors.push(new appError.SystemError({

                        option: key

                    }, 'required option'));
                }
            }
        }
    });
};

Field.prototype._cookMsg = function(msg, option, field)
{
    return msg.replace('%{option}', option || '').replace('%{field}', field || '');
};


module.exports = Field;