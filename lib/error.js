/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 28.02.13
 * Time: 9:00
 *
 * E = mc^2
 */

var $util = require('util');
var http = {};
var app = {};
var kind = {
    VALIDATION: 'ValidationError',
    SYSTEM:     'SystemError',
    DB:         'DBError',
    ACCESS:     'AccessError',
    TYPE:       'TypeError',
    UNKNOWN:    'UnknownError',
    ABSTRACT:   'AbstractError',
    SYNTAX:     'SyntaxError',
    TUBUR:      'TuburError',
    CUSTOM:     'CustomError',
    MULTI:      'MultiError'
};

function TuburError(info, message, constructor) {
    Error.captureStackTrace(this, constructor || this);

    this.type = kind.TUBUR;

    this.info = info;
    this.message = message;

    this.clear();

}
$util.inherits(TuburError, Error);
TuburError.prototype.name = kind.TUBUR;

TuburError.prototype.setType = function setType(type) {
    this.type = type;
    return this.clear();
};

TuburError.prototype.setInfo = function setInfo(info) {
    this.info = info;
    return this.clear();
};

TuburError.prototype.setMessage = function setMessage(message) {
    this.message = message;
    return this.clear();
};

TuburError.prototype.clear = function clear() {
    if (typeof this.info === "undefined" || this.info == null) delete this.info;
    if (typeof this.message === "undefined" || this.message == null) this.message = 'Error';
    return this;
};

//======================================================================================================================
// HTTP ERRORS
//======================================================================================================================

/**
 * 404 Page not found
 *
 * @param {string} message
 */
var E404 = function(message) {
    E404.super_.call(this, null, message || 'Page not found', this.constructor);
    this.status = 404;
};
$util.inherits(E404, TuburError);

/**
 * 403 Access denied
 *
 * @param {string} message
 */
var E403 = function(message) {
    E403.super_.call(this, null, message || 'Access denied', this.constructor);
    this.status = 403;
};
$util.inherits(E403, TuburError);

http.E404 = E404;
http.E403 = E403;

exports.E404 = E404;
exports.E403 = E403;
exports.http = http;


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
function ValidationError(info, message) {
    ValidationError.super_.call(this, info, message, this.constructor);
    this.type = kind.VALIDATION;
}
$util.inherits(ValidationError, TuburError);
ValidationError.prototype.name = kind.VALIDATION;

/**
 * Системная ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
function SystemError(info, message)
{
    SystemError.super_.call(this, info, message, this.constructor);
    this.type = kind.SYSTEM;
}
$util.inherits(SystemError, TuburError);
SystemError.prototype.name = kind.SYSTEM;

/**
 * Ошибка базы данных
 *
 * @param info
 * @param message
 * @constructor
 */
function DBError(info, message)
{
    DBError.super_.call(this, info, message, this.constructor);
    this.type = kind.DB;
}
$util.inherits(DBError, TuburError);
DBError.prototype.name = kind.DB;

/**
 * Ошибка доступа
 *
 * @param info
 * @param message
 * @constructor
 */
function AccessError(info, message) {
    AccessError.super_.call(this, info, message, this.constructor);
    this.type = kind.ACCESS;
}
$util.inherits(AccessError, TuburError);
AccessError.prototype.name = kind.ACCESS;

/**
 * Неизвестная науке ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
function UnknownError(info, message) {
    UnknownError.super_.call(this, info, message, this.constructor);
    this.type = kind.UNKNOWN;
}
$util.inherits(UnknownError, TuburError);
UnknownError.prototype.name = kind.UNKNOWN;

/**
 * Ошибка синтаксиса
 *
 * @param info
 * @param message
 * @constructor
 */
function SyntaxError(info, message) {
    SyntaxError.super_.call(this, info, message, this.constructor);
    this.type = kind.SYNTAX;
}
$util.inherits(SyntaxError, TuburError);
SyntaxError.prototype.name = kind.SYNTAX;

/**
 * Пользовательская ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
function CustomError(type, info, message) {
    CustomError.super_.call(this, info, message, this.constructor);
    this.type = type;
}
$util.inherits(CustomError, TuburError);
CustomError.prototype.name = kind.CUSTOM;

/**
 * Агрегатор ошибок, когда внутри должен быть массив ошибок
 *
 * @param info
 * @param message
 * @constructor
 */
function MultiError(arr, message) {
    MultiError.super_.call(this, arr, message, this.constructor);
    this.type = kind.MULTI;
}
$util.inherits(MultiError, TuburError);
MultiError.prototype.name = kind.MULTI;

//======================================================================================================================
app.ValidationError = ValidationError;
app.SystemError = SystemError;
app.AccessError = AccessError;
app.SyntaxError = SyntaxError;
app.UnknownError = UnknownError;
app.CustomError = CustomError;
exports.app = app;

exports.TuburError = exports.Error  = TuburError;
exports.ValidationError             = ValidationError;
exports.SystemError                 = SystemError;
exports.DBError                     = DBError;
exports.AccessError                 = AccessError;
exports.SyntaxError                 = SyntaxError;
exports.UnknownError                = UnknownError;
exports.CustomError                 = CustomError;
exports.MultiError                  = MultiError;

exports.kind = kind;