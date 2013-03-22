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
    error = require('../error').app,

    __$__;

var ApiClient = function(options) {

    this.options = options || {};
    this.last = {};
    this.errors = [];

    if (this.options.host == undefined)
    {
        this.errors.push(new error.SystemError(this.options, 'host not found'))
    }

};

ApiClient.prototype._checkError = function()
{
    if ( !this.errors || !this.last )
    {
        if ( !this.errors ) this.errors = [];
        if ( !this.last ) this.last = {};

        this.errors.push(new error.SystemError(this, 'constructor is not called'));

        this.last['error'] = this.errors;
        console.error(this.errors);
        return true;

    }

    if (this.errors && this.errors.length)
    {
        this.last['error'] = this.errors;
        console.error(this.errors);
        return true;
    }

    return false;

};

ApiClient.prototype.send = function(path, data, fn) {

    if (this._checkError()) return ;

    var self = this,
        url = this.options.host + path;

    fn = fn || function() {};

    this.last['url'] = url;
    this.last['data'] = data;

    request.post(url, { json: data }, function (error, response, body) {

        this.last['error'] = error;
        this.last['response'] = response;
        this.last['body'] = body;

        /**
         * Ошибка если даже запрос послать не удалось
         */
        if (error)
        {
            return fn(new packet.SystemError(null, 'Failed connect to API service'));
        }

        /**
         * Запрос послали, но ответ нас не удовлетворяет
         */
        if (response.statusCode != 200)
        {
            return fn(new packet.SystemError(null, 'API service return error: [ http code: ' + response.statusCode + ': ' + body.error.message || '*' + ' ]'));
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
            return fn(new packet.UnknownError(body));
        }

        /**
         * Всё прошло хорошо, можно поделится этой новостью с браузером
         */
        fn(null, body.result || true);

    });

};

//======================================================================================================================
//======================================================================================================================

module.exports = ApiClient;