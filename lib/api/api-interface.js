/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:39
 *
 * E = mc^2
 */


/**
 * DCP - data communication protocol
 * протокол передачи данных
 *
 * @type {*}
 * @private
 */
var __interface = module.exports = exports,

    _util = require('util'),
    error = require('../error'),

    __$__;

var status =
{
    SUCCESS: "Success",
    NOTICE: "Notice",
    ERROR: "Error"
};

var Interface = function() {

    var args = Array.prototype.slice.call(arguments);
    this.status = args[0] || null;
    this.message = args[1] || false;

};

/**
 * Формирует структуру ответа о успешном завершении операции
 *
 * @param {object} result
 * @param {string} message
 * @constructor
 */
var Success = function(result, message)
{
    Success.super_.call(this, status.SUCCESS, message);

    this.result = result || false;

};
_util.inherits(Success, Interface);

/**
 * Формирует структуру ответа о завершении операции
 *
 * @param {object} result
 * @param {string} message
 * @constructor
 */
var Notice = function(result, message)
{
    Notice.super_.call(this, status.NOTICE, message);

    this.result = result || false;

};
_util.inherits(Notice, Interface);

/**
 * Формирует структуру ответа о завершении операции с ошибками
 *
 * @param {object} err
 * @param {string} message
 * @constructor
 */
var Error = function(err, message)
{
    Error.super_.call(this, status.ERROR, message);

    this.error = err || false;

};
_util.inherits(Error, Interface);


var SystemError = function(err, message)
{
    SystemError.super_.call(this, new error.app.SystemError(err), message);
};
_util.inherits(SystemError, Error);


var ValidationError = function(err, message)
{
    ValidationError.super_.call(this, new error.app.ValidationError(err, message));
};
_util.inherits(ValidationError, Error);


//======================================================================================================================
__interface.status = status;
__interface.Success = Success;
__interface.Notice = Notice;
__interface.Error = Error;
__interface.SystemError = SystemError;
__interface.ValidationError = ValidationError;