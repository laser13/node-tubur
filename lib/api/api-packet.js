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
var $util = require('util');

var error = require('../error');
var utils = require('../utils');

var status = {
    SUCCESS: "Success",
    NOTICE: "Notice",
    ERROR: "Error"
};

function Packet() {
    var args = Array.prototype.slice.call(arguments);
    this.status = args[0] || null;
    this.message = args[1] || false;
    if (!utils.isSet(this.message)) delete this.message;
}

/**
 * Формирует структуру ответа о успешном завершении операции
 *
 * @param {object} result
 * @param {string} message
 * @constructor
 */
function Success(result, message) {
    Success.super_.call(this, status.SUCCESS, message);
    this.result = utils.isSet(result) ? result : true;
}
$util.inherits(Success, Packet);

/**
 * Формирует структуру ответа о завершении операции
 *
 * @param {object} result
 * @param {string} message
 * @constructor
 */
function Notice(result, message) {
    Notice.super_.call(this, status.NOTICE, message);
    this.result = utils.isSet(result) ? result : true;
}
$util.inherits(Notice, Packet);

/**
 * Формирует структуру ответа о завершении операции с ошибками
 *
 * @param {object} err
 * @param {string} message
 * @constructor
 */
function Error(err, message) {
    Error.super_.call(this, status.ERROR, message);
    this.error = err || false;
}
$util.inherits(Error, Packet);

function SystemError(err, message) {
    if ( !utils.isSystemError(err) ) err = new error.SystemError(err, message);
    SystemError.super_.call(this, err);
}
$util.inherits(SystemError, Error);

function AccessError(err, message) {
    if ( !utils.isAccessError(err) ) err = new error.AccessError(err, message);
    AccessError.super_.call(this, err);
}
$util.inherits(AccessError, Error);

function ValidationError(err, message) {
    if ( !utils.isValidationError(err) ) err = new error.ValidationError(err, message);
    ValidationError.super_.call(this, err);
}
$util.inherits(ValidationError, Error);

function UnknownError(err, message) {
    if ( !utils.isUnknownError(err) ) err = new error.UnknownError(err, message);
    UnknownError.super_.call(this, err);
}
$util.inherits(UnknownError, Error);

//======================================================================================================================
exports.status = status;
exports.Success = Success;
exports.Notice = Notice;
exports.Error = Error;
exports.SystemError = SystemError;
exports.AccessError = AccessError;
exports.ValidationError = ValidationError;
exports.UnknownError = UnknownError;