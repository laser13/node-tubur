/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 11.04.13
 * Time: 7:52
 *
 * E = mc^2
 */

var packet = require('./api-packet');

function errorOrSuccess(err, result) {
    if (err) return new packet.Error(err);
    return new packet.Success(result);
}

function errorOrNotice(err, result) {
    if (err) return new packet.Error(err);
    return new packet.Notice(result);
}

exports.errorOrSuccess = errorOrSuccess;
exports.errorOrNotice = errorOrNotice;