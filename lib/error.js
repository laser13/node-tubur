/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 28.02.13
 * Time: 9:00
 *
 * E = mc^2
 */

var __error = module.exports = exports,

    _util = require('util'),

    __$__;



__error.http = {};
__error.app = {};

var kind =
{
    VALIDATION: 'ValidationError',
    SYSTEM: 'SystemError',
    DB: 'DBError',
    ACCESS: 'AccessError',
    TYPE: 'TypeError',
    UNKNOWN: 'UnknownError',
    ABSTRACT: 'AbstractError',
    SYNTAX: 'SyntaxError'
};

var TuburError = function (info, message, constructor)
{
    Error.captureStackTrace(this, constructor || this);

    this.type = 'TuburError';

    this.info = info || false;
    this.message = message || false;

    if (!this.info) delete this.info;
    if (!this.message) delete this.message;

};
_util.inherits(TuburError, Error);


//======================================================================================================================
// HTTP ERRORS
//======================================================================================================================

/**
 * 404 Page not found
 *
 * @param {string} message
 */
var E404 = function(message)
{
    E404.super_.call(this, null, message || 'Page not found', this.constructor);
    this.status = 404;
};
_util.inherits(E404, TuburError);

/**
 * 403 Access denied
 *
 * @param {string} message
 */
var E403 = function(message)
{
    E403.super_.call(this, null, message || 'Access denied', this.constructor);
    this.status = 403;
};
_util.inherits(E403, TuburError);

__error.http.E404 = E404;
__error.http.E403 = E403;

__error.E404 = E404;
__error.E403 = E403;


//======================================================================================================================
// APP ERRORS
//======================================================================================================================

/**
 * Ошибка валидации данных
 *
 * @param {object} info
 * @param {string} message
 * @constructor
 */
var ValidationError = function (info, message)
{
    ValidationError.super_.call(this, info, message, this.constructor);
    this.type = kind.VALIDATION;
};
_util.inherits(ValidationError, TuburError);

/**
 * Системная ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
var SystemError = function (info, message)
{
    SystemError.super_.call(this, info, message, this.constructor);
    this.type = kind.SYSTEM;
};
_util.inherits(SystemError, TuburError);

/**
 * Ошибка базы данных
 *
 * @param info
 * @param message
 * @constructor
 */
var DBError = function (info, message)
{
    DBError.super_.call(this, info, message, this.constructor);
    this.type = kind.DB;
};
_util.inherits(DBError, TuburError);

/**
 * Ошибка доступа
 *
 * @param info
 * @param message
 * @constructor
 */
var AccessError = function (info, message)
{
    AccessError.super_.call(this, info, message, this.constructor);
    this.type = kind.ACCESS;
};
_util.inherits(AccessError, TuburError);

/**
 * Неизвестная науке ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
var UnknownError = function (info, message)
{
    UnknownError.super_.call(this, info, message, this.constructor);
    this.type = kind.UNKNOWN;
};
_util.inherits(UnknownError, TuburError);

/**
 * Ошибка синтаксиса
 *
 * @param info
 * @param message
 * @constructor
 */
var SyntaxError = function (info, message)
{
    SyntaxError.super_.call(this, info, message, this.constructor);
    this.type = kind.SYNTAX;
};
_util.inherits(SyntaxError, TuburError);

/**
 * Пользовательская ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
var CustomError = function (type, info, message)
{
    CustomError.super_.call(this, info, message, this.constructor);
    this.type = type;
};
_util.inherits(CustomError, TuburError);


//======================================================================================================================
__error.app.ValidationError = ValidationError;
__error.app.SystemError = SystemError;
__error.app.AccessError = AccessError;
__error.app.SyntaxError = SyntaxError;
__error.app.UnknownError = UnknownError;
__error.app.CustomError = CustomError;

__error.ValidationError = ValidationError;
__error.SystemError = SystemError;
__error.DBError = DBError;
__error.AccessError = AccessError;
__error.SyntaxError = SyntaxError;
__error.UnknownError = UnknownError;
__error.CustomError = CustomError;

__error.kind = kind;