/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.03.13
 * Time: 7:39
 *
 * E = mc^2
 */

var _request = require('request'),

    interface = require('./api-interface'),

    __$__;

var ApiClient = function(options) {

};

ApiClient.prototype.send = function(url, data, fn) {

    _request.post(url, { json: data }, function (error, response, body) {

        /**
         * Ошибка если даже запрос послать не удалось
         */
        if (error)
        {
            return fn(new interface.SystemError(null, 'Failed connect to DSP service'));
        }

        /**
         * Запрос послали, но ответ нас не удовлетворяет
         */
        if (response.statusCode != 200)
        {
            return fn(new interface.SystemError(null, 'API service return error: [ http code: ' + response.statusCode + ': ' + body + ' ]'));
        }

        /**
         * Ответ есть, но пришла ошибка
         */
        if (body.status == interface.status.ERROR)
        {
            return fn(new interface.SystemError(body.error, body.error.message));
        }

        /**
         * Ответ есть, но что-то там пошло не так
         */
        if (body.status !== interface.status.SUCCESS && body.status !== interface.status.ERROR)
        {
            return fn(new interface.UnknownError(body));
        }

        /**
         * Всё прошло хорошо, можно поделится этой новостью с браузером
         */
        fn(null, body);

    });

};

//======================================================================================================================
//======================================================================================================================

module.exports = ApiClient;