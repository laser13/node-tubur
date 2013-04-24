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
var __packet = module.exports = exports,

    $util = require('util'),
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

    if (!this.message) delete this.message;

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

    this.result = (result == null || typeof result === "undefined") ? true : result;

};
$util.inherits(Success, Interface);

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

    this.result = (result == null || typeof result === "undefined") ? true : result;

};
$util.inherits(Notice, Interface);

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
$util.inherits(Error, Interface);

//======================================================================================================================
var SystemError = function(err, message)
{
    if ( !(err instanceof error.app.SystemError) ) err = new error.app.SystemError(err, message);
    SystemError.super_.call(this, err);
};
$util.inherits(SystemError, Error);

//======================================================================================================================
var AccessError = function(err, message)
{
    if ( !(err instanceof error.app.AccessError) ) err = new error.app.AccessError(err, message);
    AccessError.super_.call(this, err);
};
$util.inherits(AccessError, Error);

//======================================================================================================================
var ValidationError = function(err, message)
{
    if ( !(err instanceof error.app.ValidationError) ) err = new error.app.ValidationError(err, message);
    ValidationError.super_.call(this, err);
};
$util.inherits(ValidationError, Error);

//======================================================================================================================
var UnknownError = function(err, message)
{
    if ( !(err instanceof error.app.UnknownError) ) err = new error.app.UnknownError(err, message);
    UnknownError.super_.call(this, err);
};
$util.inherits(UnknownError, Error);


//======================================================================================================================
__packet.status = status;
__packet.Success = Success;
__packet.Notice = Notice;
__packet.Error = Error;
__packet.SystemError = SystemError;
__packet.AccessError = AccessError;
__packet.ValidationError = ValidationError;
__packet.UnknownError = UnknownError;