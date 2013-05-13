/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 28.02.13
 * Time: 9:00
 *
 * E = mc^2
 */

var $util = require('util');
var utils = require('./utils');

var kind = {
    TUBUR:      'TuburError',
    ABSTRACT:   'AbstractError',
    SYSTEM:     'SystemError',
    DB:         'DbError',
    ACCESS:     'AccessError',
    TYPE:       'TypeError',
    VALIDATION: 'ValidationError',
    UNKNOWN:    'UnknownError',
    SYNTAX:     'SyntaxError',
    CUSTOM:     'CustomError',

    MULTI:      'MultiError',

    HTTP:       'HttpError',
    HTTP202:    'HttpError202',
    HTTP204:    'HttpError204',
    HTTP400:    'HttpError400',
    HTTP403:    'HttpError403',
    HTTP404:    'HttpError404',
    HTTP500:    'HttpError500',
    HTTP503:    'HttpError503'
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

TuburError.prototype.getDescription = function() {
    return 'Нет описания';
};

TuburError.prototype.setName = function setName(name) {
    TuburError.prototype.name = name;
    return this.clear();
};

TuburError.prototype.setType = function setType(type) {
    this.type = type;
    return this.clear();
};

TuburError.prototype.setCode = function setCode(code) {
    this.code = code;
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
    if (typeof this.code === "undefined" || this.code == null) delete this.code;
    if (typeof this.message === "undefined" || this.message == null) this.message = 'Error';
    return this;
};

//======================================================================================================================
// HTTP ERRORS
//======================================================================================================================
var EXXX = function(type, status, message, constructor) {
    EXXX.super_.call(this, null, message, constructor || this.constructor);
    this.setType(type || kind.HTTP).setName(type || kind.HTTP);
    this.status = status;
};
$util.inherits(EXXX, TuburError);


//======================================================================================================================
// HTTP ERRORS 200
//======================================================================================================================
/**
 * 202 Accepted
 *
 * запрос был принят на обработку, но она не завершена.
 * Клиенту не обязательно дожидаться окончательной передачи сообщения, так как может быть начат очень долгий процесс.
 * Появился в HTTP/1.0
 *
 * @param {string} message
 */
var E202 = function(message) {
    E202.super_.call(this, kind.HTTP202, 202, message || 'Accepted', this.constructor);

};
$util.inherits(E202, EXXX);

E202.prototype.getDescription = function() {
    return '202 Accepted. Запрос был принят на обработку, но она не завершена. Клиенту не обязательно дожидаться окончательной передачи сообщения, так как может быть начат очень долгий процесс. Появился в HTTP/1.0';
};

/**
 * 204 No Content
 *
 * сервер успешно обработал запрос, но в ответе были переданы только заголовки без тела сообщения.
 * Клиент не должен обновлять содержимое документа, но может применить к нему полученные метаданные.
 * Появился в HTTP/1.0.
 *
 * @param {string} message
 */
var E204 = function(message) {
    E204.super_.call(this, kind.HTTP204, 204, message || 'No Content', this.constructor);
};
$util.inherits(E204, EXXX);

E204.prototype.getDescription = function() {
    return '204 No Content. Сервер успешно обработал запрос, но в ответе были переданы только заголовки без тела сообщения. Клиент не должен обновлять содержимое документа, но может применить к нему полученные метаданные. Появился в HTTP/1.0.';
};

//======================================================================================================================
// HTTP ERRORS 400
//======================================================================================================================
/**
 * 400 Bad Request
 *
 * сервер обнаружил в запросе клиента синтаксическую ошибку.
 * Появился в HTTP/1.0.
 *
 * @param {string} message
 */
var E400 = function(message) {
    E400.super_.call(this, kind.HTTP400, 400, message || 'Bad Request', this.constructor);
};
$util.inherits(E400, EXXX);

E400.prototype.getDescription = function() {
    return '400 Bad Request. Сервер обнаружил в запросе клиента синтаксическую ошибку. Появился в HTTP/1.0';
};

/**
 * 403 Forbidden
 *
 *  сервер понял запрос, но он отказывается его выполнять из-за ограничений в доступе для клиента к указанному ресурсу.
 *  Появился в HTTP/1.0.
 *
 * @param {string} message
 */
var E403 = function(message) {
    E403.super_.call(this, 403, message || 'Forbidden', this.constructor);
};
$util.inherits(E403, EXXX);

E403.prototype.getDescription = function() {
    return '403 Forbidden. Сервер понял запрос, но он отказывается его выполнять из-за ограничений в доступе для клиента к указанному ресурсу. Появился в HTTP/1.0';
};

/**
 * 404 Not Found
 *
 * Сервер понял запрос, но не нашёл соответствующего ресурса по указанному URI.
 * Если серверу известно, что по этому адресу был документ, то ему желательно использовать код 410.
 * Ответ 404 может использоваться вместо 403, если требуется тщательно скрыть от посторонних глаз определённые ресурсы.
 * Появился в HTTP/1.0.
 *
 * @param {string} message
 */
var E404 = function(message) {
    E404.super_.call(this, 404, message || 'Not Found', this.constructor);
};
$util.inherits(E404, EXXX);

E404.prototype.getDescription = function() {
    return '404 Not Found. Сервер понял запрос, но не нашёл соответствующего ресурса по указанному URI. Появился в HTTP/1.0';
};

//======================================================================================================================
// HTTP ERRORS 500
//======================================================================================================================
/**
 * 500 Internal Server Error
 *
 * любая внутренняя ошибка сервера, которая не входит в рамки остальных ошибок класса.
 * Появился в HTTP/1.0.
 *
 * @param {string} message
 */
var E500 = function(message) {
    E500.super_.call(this, 500, message || 'Internal Server Error', this.constructor);
};
$util.inherits(E500, EXXX);

E500.prototype.getDescription = function() {
    return '500 Internal Server Error. Любая внутренняя ошибка сервера, которая не входит в рамки остальных ошибок класса. Появился в HTTP/1.0';
};

/**
 * 503 Service Unavailable
 *
 * сервер временно не имеет возможности обрабатывать запросы по техническим причинам (обслуживание, перегрузка и прочее).
 * В поле Retry-After заголовка сервер может указать время, через которое клиенту рекомендуется повторить запрос.
 * Хотя во время перегрузки очевидным кажется сразу разрывать соединение,
 * эффективней может оказаться установка большого значения поля Retry-After для уменьшения частоты избыточных запросов.
 * Появился в HTTP/1.0.
 *
 * @param {string} message
 */
var E503 = function(message) {
    E503.super_.call(this, 503, message || 'Service Unavailable', this.constructor);
};
$util.inherits(E503, EXXX);

E503.prototype.getDescription = function() {
    return '503 Service Unavailable. Сервер временно не имеет возможности обрабатывать запросы по техническим причинам (обслуживание, перегрузка и прочее). Появился в HTTP/1.0';
};

exports.E202 = E202;
exports.E204 = E204;
exports.E400 = E400;
exports.E403 = E403;
exports.E404 = E404;
exports.E500 = E500;
exports.E503 = E503;


//======================================================================================================================
// APPLICATION ERRORS
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
    this.setType(kind.VALIDATION).setName(kind.VALIDATION);
}
$util.inherits(ValidationError, TuburError);

/**
 * Системная ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
function SystemError(info, message) {
    SystemError.super_.call(this, info, message, this.constructor);
    this.setType(kind.SYSTEM).setName(kind.SYSTEM);
}
$util.inherits(SystemError, TuburError);

/**
 * Ошибка базы данных
 *
 * @param info
 * @param message
 * @constructor
 */
function DbError(info, message) {
    DbError.super_.call(this, info, message, this.constructor);
    this.setType(kind.DB).setName(kind.DB);
}
$util.inherits(DbError, TuburError);

/**
 * Ошибка доступа
 *
 * @param info
 * @param message
 * @constructor
 */
function AccessError(info, message) {
    AccessError.super_.call(this, info, message, this.constructor);
    this.setType(kind.ACCESS).setName(kind.ACCESS);
}
$util.inherits(AccessError, TuburError);

/**
 * Неизвестная науке ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
function UnknownError(info, message) {
    UnknownError.super_.call(this, info, message, this.constructor);
    this.setType(kind.UNKNOWN).setName(kind.UNKNOWN);
}
$util.inherits(UnknownError, TuburError);

/**
 * Ошибка синтаксиса
 *
 * @param info
 * @param message
 * @constructor
 */
function SyntaxError(info, message) {
    SyntaxError.super_.call(this, info, message, this.constructor);
    this.setType(kind.SYNTAX).setName(kind.SYNTAX);
}
$util.inherits(SyntaxError, TuburError);

/**
 * Пользовательская ошибка
 *
 * @param info
 * @param message
 * @constructor
 */
function CustomError(type, info, message) {
    CustomError.super_.call(this, info, message, this.constructor);
    this.setType(type).setName(type);
    this.type = type;
}
$util.inherits(CustomError, TuburError);

/**
 * Агрегатор ошибок, когда внутри должен быть массив ошибок
 *
 * @param {Array} errors
 * @param {string} message
 * @constructor
 */
function MultiError(errors, message) {

    var self = this;
    var errs = [];

    MultiError.super_.call(this, null, message, this.constructor);
    this.setType(kind.MULTI).setName(kind.MULTI);
    if (utils.isArray(errors)) {
        errors.forEach(function(err) {
            if (err instanceof MultiError) {
                errs.concat(err.getErrors());
            }
            else {
                errs.push(err);
            }
        });
    }
    this.list = errs;
    this.errors = {};
    this.errors[kind.VALIDATION] = [];
    this.errors[kind.SYSTEM] = [];
    this.errors[kind.SYNTAX] = [];
    this.errors[kind.DB] = [];
    this.errors[kind.ACCESS] = [];
    this.errors[kind.UNKNOWN] = [];
    this.list.forEach(function(err) {

        if (utils.isValidationError(err)) self.errors[kind.VALIDATION].push(err);
        if (utils.isSystemError(err)) self.errors[kind.SYSTEM].push(err);
        if (utils.isSyntaxError(err)) self.errors[kind.SYNTAX].push(err);
        if (utils.isDbError(err)) self.errors[kind.DB].push(err);
        if (utils.isAccessError(err)) self.errors[kind.ACCESS].push(err);
        if (utils.isUnknownError(err)) self.errors[kind.UNKNOWN].push(err);

    });
}
$util.inherits(MultiError, TuburError);

MultiError.prototype.getErrors = function getErrors() {
    return ( this.list instanceof Array ) ? this.list : [];
};

//======================================================================================================================
exports.TuburError = exports.Error  = TuburError;
exports.ValidationError             = ValidationError;
exports.SystemError                 = SystemError;
exports.DbError                     = DbError;
exports.AccessError                 = AccessError;
exports.SyntaxError                 = SyntaxError;
exports.UnknownError                = UnknownError;
exports.CustomError                 = CustomError;
exports.MultiError                  = MultiError;

exports.kind = kind;