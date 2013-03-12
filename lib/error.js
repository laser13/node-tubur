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
    ACCESS: 'AccessError',
    TYPE: 'TypeError',
    UNKNOWN: 'UnknownError',
    ABSTRACT: 'AbstractError',
    SYNTAX: 'Syntax'
};

var TuburError = function (message, constructor)
{
    Error.captureStackTrace(this, constructor || this);
    this.message = message || false;
    this.type = 'TuburError';
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
    E404.super_.call(this, message || 'Page not found', this.constructor);
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
    E403.super_.call(this, message || 'Access denied', this.constructor);
    this.status = 403;
};
_util.inherits(E403, TuburError);

__error.http.E404 = E404;
__error.http.E403 = E403;


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
    ValidationError.super_.call(this, message, this.constructor);

    this.type = kind.VALIDATION;
    this.info = info || false;
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
    SystemError.super_.call(this, message, this.constructor);

    this.type = kind.SYSTEM;
    this.info = info || false;
};
_util.inherits(SystemError, TuburError);

/**
 * Ошибка доступа
 *
 * @param info
 * @param message
 * @constructor
 */
var AccessError = function (info, message)
{
    AccessError.super_.call(this, message, this.constructor);

    this.type = kind.ACCESS;
    this.info = info || false;
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
    UnknownError.super_.call(this, message, this.constructor);

    this.type = kind.UNKNOWN;
    this.info = info || false;
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
    SyntaxError.super_.call(this, message, this.constructor);

    this.type = kind.SYNTAX;
    this.info = info || false;
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
    CustomError.super_.call(this, message, this.constructor);

    this.type = type;
    this.info = info || false;
};
_util.inherits(CustomError, TuburError);


//======================================================================================================================
__error.app.ValidationError = ValidationError;
__error.app.SystemError = SystemError;
__error.app.AccessError = AccessError;
__error.app.SyntaxError = SyntaxError;
__error.app.UnknownError = UnknownError;
__error.app.CustomError = CustomError;

__error.kind = kind;