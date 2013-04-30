/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 08.03.13 --- 22:37
 *
 * E = mc^2
 */

require('./array');
var _serializer = require('serializer'),

    utils = require('./utils'),
    error = require('./error');

function Wait()
{
    var args = Array.prototype.slice.call(arguments),
        options = args.pop() || {};

    // Название блока заданий
    options.label = options.label || 'JOB[' + _serializer.randomString(32) + ']';

    // Время жизни заданий, по умолчанию 5 минут. 0 - без времени жизни
    options.vita = options.vita || 5 * 60 * 1000;

    // Интервал проверки выполнения заданий
    options.interval = options.interval || 0;

    // Логирование заданий и ожиданий
    options.log = options.log || false;

    this.options = options;

    // Массив заданий
    this.jobs = args || [];

    // Стоп ключ
    this.stopKey = false;

    // Массив ошибок
    this.errors = [];

}

/**
 * Останавливает весь процесс выполнения работ
 */
Wait.prototype.stop = function()
{
    this.stopKey = true;
};

/**
 * Добавляет новое задание
 *
 * @param job
 * @returns {*}
 */
Wait.prototype.add = function(position, job)
{
    var key = _serializer.randomString(64);

    if ( utils.isFunction(job) )
    {
        if ( !utils.isObject(this.jobs[position]) ) this.jobs[position] = {};
        this.jobs[position][key] = job;
    }

};

/**
 * Параллельные задания
 */
Wait.prototype.heap = function heap()
{
    var _wait = this,
        jobs = Array.prototype.slice.call(arguments),
        position = ( !this.jobs.length ) ? 0 : this.jobs.length - 1;

    jobs.forEach(function(job) {

        _wait.add(position, job);

    });

};

/**
 * Последовательные задания
 */
Wait.prototype.turn = function turn()
{
    var _wait = this,
        jobs = Array.prototype.slice.call(arguments),
        position = this.jobs.length;

    jobs.forEach(function(job) {

        _wait.add(position, job);
        position++;

    });

};

/**
 * Ожидаем выполнение всех заданий
 * @param callback
 */
Wait.prototype.run = function(callback)
{
    this.startTime = new Date().getTime();
    this._launch(callback);

};

/**
 * Запускаем задания согласно очереди
 *
 * @param callback
 * @returns {*}
 * @private
 */
Wait.prototype._launch = function(callback)
{
    var _wait = this;

    // Заданий больше нет, можно вернуть всё что имеем
    if ( this.jobs.length == 0 )
    {
        var err = (_wait.errors.length) ? _wait.errors : null;
        return callback(err);
    }

    // Получили первый набор заданий
    var jobset = this.jobs.shift(),
        keys = [];

    if (typeof jobset !== "object") return _wait._launch(callback);

    // Пробегаемся по одноранговым заданиям
    for (var key in jobset)
    {
        keys.push(key);

        // И запускаем каждое задание
        (function(key) {

            if (_wait.options.log) console.log('Запускаем задание: ', key);
            // Это наша функция ok(err)
            jobset[key](function(err) {

                if (err) _wait.errors.push(err);

                if (_wait.options.log) console.log('Завершили задание: ', key);
                keys.remove(key);

            });

        })(key);
    }

    (function loop() {

        setTimeout(function() {

            var currTime = new Date().getTime();

            // Поступил сигнал остановить эту затею
            if (_wait.stopKey)
            {
                keys = [];
                _wait.errors.push(new error.SystemError(null, 'поступил STOP сигнал'));
            }

            // Превысили время выполнения
            if ( _wait.options.vita && ((currTime - _wait.startTime) > _wait.options.vita) )
            {
                keys = [];
                _wait.errors.push(new error.SystemError(null, 'превышено время ожидания ' + (_wait.options.vita / 1000) + ' сек.'));
            }

            if ( keys.length ) return setTimeout(loop, _wait.options.interval);

            _wait._launch(callback);

        }, 0);

    })();

};

module.exports = Wait;