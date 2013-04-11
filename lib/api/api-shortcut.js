/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 11.04.13
 * Time: 7:52
 *
 * E = mc^2
 */

var __shortcut = module.exports = exports,

    packet = require('./api-packet'),

    __$__;

__shortcut.errorOrSuccess = function(err, result)
{
    if (err) return new packet.Error(err);
    return new packet.Success(result);
};

__shortcut.errorOrNotice = function(err, result)
{
    if (err) return new packet.Error(err);
    return new packet.Notice(result);
};