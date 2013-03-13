/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 12.03.13 --- 6:42
 *
 * E = mc^2
 */

require('./array');
var _util = require('util'),

    _validator = require('validator'),
    validator = new _validator.Validator(),
    filter = new _validator.Filter(),

    error = require('./error').app,

    __$__;

var SDS = function(data) {};

SDS.prototype.field = function(fieldName, options)
{
    if (this.fields === undefined) this.fields = {};
    this.fields[fieldName] = options || { required: false, type: 'string' };
};

SDS.prototype.isValid = function() {

    if (this.errors !== undefined && this.errors.length) return false;
    return true;

};

SDS.prototype.getErrors = function() {

    return this.errors || false;

};

SDS.prototype.toObject = function() {

    if ( !this.isValid() ) return {};

    function check(item)
    {
        if (typeof item === 'object' && item['toObject'] !== undefined)
        {
            return item.toObject();
        }
        return item;
    }

    var obj = {};
    for (var key in this.fields)
    {
        if (this[key] !== undefined) {

            if (this[key] instanceof Array)
            {
                obj[key] = this[key].map(function(item) { return check(item) });
            }
            else
            {
                obj[key] = check(this[key]);
            }
        }
    }

    return obj;
};

SDS.prototype.init = function(initial)
{
    this.errors = [];

    var _type = ['string', 'number', 'boolean', 'object'],
        _instance = ['Array', 'Date', 'Buffer'];

    function norm(value, type)
    {
        if (type == 'string')
        {
            return filter.sanitize(value).trim();
        }
        if (type == 'number')
        {
            return filter.sanitize(value).toInt();
        }
        if (type == 'boolean')
        {
            return filter.sanitize(value).toBoolean();
        }
        if (type == 'Date')
        {
            var date = new Date(value);
            if (_util.isDate(date)) return date;
        }

        return value;
    }

    /**
     * Пробегаемся полям
     */
    for (var key in this.fields)
    {
        var prop = this.fields[key], // Свойства поля
            arrayFlag = false, // Флаг указывающий что поле является массивом
            clue = key, // Ключ по которому будем искать значения
            fieldType = prop.type;

        //
        // Если в свойствах поля указан ключь, то применим его
        //
        if (typeof prop.clue !== 'undefined')
        {
            clue = prop.clue;
        }

        //
        // Получаем значение поля по указанному ключу
        //
        var value = initial[clue];

        //
        // Проверяем тип поля, является ли он массивом
        //
        if (fieldType.indexOf('[]') !== -1)
        {
            fieldType = fieldType.replace('[]', '');
            arrayFlag = true;
        }

        //
        // Если поле обязательное, а не пришло, то записываем ошибку
        //
        if ( prop.required && value === undefined )
        {
            this.errors.push(new error.ValidationError({ field: key, value: value }, 'required field'));
        }

        //
        // Значение существует
        //
        if (value !== undefined)
        {
            //
            // Удаляем данное поле из неизвестных
            //
//            delete this.unknown[clue];

            //
            // Нормализуем его, если это не массив
            //
            if ( !arrayFlag )
                value = norm(value, fieldType);

            /**
             * Если у поля стандартный простой тип (number, string, boolean)
             */
            if (_type.has(fieldType))
            {
                /**
                 * Поле должно быть массивом
                 */
                if (arrayFlag)
                {
                    // Если поле массив
                    if (typeof value === 'object' && value instanceof Array)
                    {
                        var _ = [];
                        for (var i = 0, len = value.length; i < len; i++)
                        {
                            // Если тип правильный
                            if (typeof value[i] === fieldType)
                            {
                                _.push(norm(value[i], fieldType));
                            }
                            // Если тип неправильный, то запишем ошибку
                            else
                            {
                                _.push(value[i]);

                                this.errors.push(new error.ValidationError({ field: key+'['+i+']', value: value[i] }, 'value should be type of ' + fieldType));
                            }

                        }
                        value = _;
                    }
                    // Если поле не массив, то запишем ошибку
                    else
                    {
                        this.errors.push(new error.ValidationError({ field: key, value: value }, 'value should be instance of Array'));
                    }

                }
                // Поле не должно быть массивом
                else
                {
                    // Если тип правильный
                    if (typeof value === fieldType)
                    {
                        value = norm(value, fieldType);
                    }
                    // Если тип неправильный, то запишем ошибку
                    else
                    {
                        this.errors.push(new error.ValidationError({ field: key, value: value }, 'value should be type of ' + fieldType));
                    }
                }
            }

            // Если поле нестандартного типа, то проверим его instance
            if (!_type.has(fieldType))
            {
                // Поле должно быть объектом
                if (typeof value !== 'object')
                {
                    this.errors.push(new error.ValidationError({ field: key, value: value }, 'value should be instance of ' + fieldType));
                }
                else
                {
                    if (typeof prop.instance === 'function')
                    {
                        var klass = prop.instance;
                    }
                    else
                    {
                        var klass = eval(fieldType);
                    }

                    // Поле должно быть массивом
                    if (arrayFlag)
                    {
                        // Если это не массив, то выкидываем ошибку
                        if ( !(value instanceof Array) )
                        {
                            this.errors.push(new error.ValidationError({ field: key, value: value }, 'value should be instance of Array'));
                        }
                        // Всё впорядке это массив
                        else
                        {
                            // Проверяем в стандартных классах
                            if ( _instance.has(fieldType) )
                            {
                                for (var i = 0, len = value.length; i < len; i++)
                                {
                                    if ( !(value[i] instanceof klass) )
                                    {
                                        this.errors.push(new error.ValidationError({ field: key+'['+i+']', value: value[i] }, 'value should be instance of ' + fieldType));
                                    }
                                }
                            }
                            // Если класс пользовательский
                            /**
                             * @todo Сделать проброс ошибок выше
                             */
                            else
                            {
                                var _ = [];
                                for (var i = 0, len = value.length; i < len; i++)
                                {
                                    if (value[i] instanceof klass)
                                    {
                                        _.push(value[i]);
                                    }
                                    else
                                    {
                                        _.push(new klass(value[i]));
                                    }

                                }
                                value = _;
                            }
                        }
                    }
                    // Поле не должно быть массивом
                    else
                    {
                        // Проверяем в стандартных классах
                        if ( _instance.has(fieldType) )
                        {
                            if ( !(value instanceof klass) )
                            {
                                this.errors.push(new error.ValidationError({ field: key, value: value }, 'value should be instance of ' + fieldType));
                            }
                        }
                        // Если класс пользовательский
                        else
                        {
                            if ( !(value instanceof klass) )
                            {
                                value = new klass(value);
                            }
                        }

                    }

                }

            }
            this[key] = value;

        }

    }

    if (this.errors.length == 0)
    {
        delete this.errors;
    }

};

module.exports = SDS;