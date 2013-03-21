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

    __$__;

var ApiClient = function(options, log) {

    this.log = log || false;

};

ApiClient.prototype.send = function(path, data, fn) {

    var self = this,
        url = this.host + path;

    fn = fn || function() {};

    if (this.log)
    {
        console.log("START\n=======================\n");
        util.log('Посылаем запрос');
        console.log('URL: ', url);
        console.log('data: ', data);
    }

    request.post(url, { json: data }, function (error, response, body) {

        if (self.log)
        {
            util.log('Результат запроса:');
            console.log('ERROR: ', error);
            console.log('RESPONSE: ', response);
            console.log('BODY: ', body);
            console.log("\n=======================\nEND");
        }

        /**
         * Ошибка если даже запрос послать не удалось
         */
        if (error)
        {
            return fn(new packet.SystemError(null, 'Failed connect to DSP service'));
        }

        /**
         * Запрос послали, но ответ нас не удовлетворяет
         */
        if (response.statusCode != 200)
        {
            return fn(new packet.SystemError(null, 'API service return error: [ http code: ' + response.statusCode + ': ' + body.error.message + ' ]'));
        }

        /**
         * Ответ есть, но пришла ошибка
         */
        if (body.status == packet.status.ERROR)
        {
            return fn(new packet.SystemError(body.error, body.error.message));
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