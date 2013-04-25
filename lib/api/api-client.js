/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:39
 *
 * E = mc^2
 */

var request = require('request'),
    util = require('util'),

    packet = require('./api-packet'),
    terror = require('../error'),
    utils = require('../utils'),

    __$__;

function ApiClient(options)
{
    this.options = options || {};
    this.last = {};
    this.errors = [];

    if ( utils.isUndefined(this.options.host) )
    {
        throw new terror.SystemError(this.options, 'host not found');
    }
}

ApiClient.prototype._checkError = function()
{
    if ( !this.errors || !this.last )
    {
        throw new terror.SystemError(null, 'constructor is not called');
    }
};

ApiClient.prototype.send = function send(path, data, fn) {

    this._checkError();

    var self = this,
        url = this.options.host + path;

    fn = fn || function() {};

    this.last['url'] = url;
    this.last['data'] = data;

    request.post(url, { json: data }, function (err, response, body) {

        self.last['error'] = utils.isSet(err) ? err : false;
        self.last['response'] = response;
        self.last['body'] = body;

        /**
         * Ошибка если даже запрос послать не удалось
         */
        if (err)
        {
            return fn(new terror.SystemError(err, 'Failed connect to API service [' + url + ']'));
        }

        /**
         * Запрос послали, но ответ нас не удовлетворяет
         */
        if (response.statusCode != 200)
        {
            var message = (utils.hasKey(body, 'error', 'message')) ? body.error.message : 'error';
            return fn(new terror.SystemError(null, 'API service return error: [ http code: ' + response.statusCode + ': ' + message + ' ]'));
        }

        /**
         * Ответ есть, но пришла ошибка
         */
        if (body.status == packet.status.ERROR)
        {
            return fn(body.error || true);
        }

        /**
         * Ответ есть, но что-то там пошло не так
         */
        if (body.status !== packet.status.SUCCESS && body.status !== packet.status.ERROR)
        {
            return fn(new terror.UnknownError(body));
        }

        /**
         * Всё прошло хорошо, можно поделится этой новостью с браузером
         */
        fn(null, body.result);

    });

};

//======================================================================================================================
//======================================================================================================================

module.exports = ApiClient;