/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 08.03.13 --- 22:37
 *
 * E = mc^2
 */

require('./array');
var _serializer = require('serializer');

var Wait = function()
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
    this.jobs = args || [];
    this.stop = false;

};

/**
 * Останавливает весь процесс выполнения работ
 */
Wait.prototype.stop = function()
{
    this.stop = true;
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

    if (typeof job === "function")
    {
        if ( typeof this.jobs[position] !== "object" ) this.jobs[position] = {};
        this.jobs[position][key] = job;
    }

};

Wait.prototype.heap = function()
{
    var _wait = this,
        jobs = Array.prototype.slice.call(arguments),
        position = ( !this.jobs.length ) ? 0 : this.jobs.length - 1;

    jobs.forEach(function(job) {

        _wait.add(position, job);

    });

};

Wait.prototype.turn = function()
{
    var _wait = this,
        jobs = Array.prototype.slice.call(arguments),
        position = this.jobs.length;

    jobs.forEach(function(job) {

        _wait.add(position, job);
        position++;

    });

};

Wait.prototype.run = function(callback)
{
    this.startTime = new Date().getTime();
    this._launch(callback);

};

Wait.prototype._launch = function(callback)
{
    var _wait = this;

    if ( !this.jobs.length ) return callback();

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
            jobset[key](function() {

                if (_wait.options.log) console.log('Завершили задание: ', key);
                keys.remove(key);

            });

        })(key);
    }

    (function loop() {

        setTimeout(function() {

            var currTime = new Date().getTime();

            if (_wait.options.log) console.log('.');

            // Поступил сигнал остановить эту затею
            if (_wait.stop)
            {
                console.log('Поступил STOP сигнал');
                return ;
            }

            // Превысили время выполнения
            if ( _wait.options.vita && ((currTime - _wait.startTime) > _wait.options.vita) )
            {
                console.log('Превышено время ожидания - ' + _wait.options.vita);
                return ;
            }

            if ( keys.length ) return setTimeout(loop, _wait.options.interval);

            _wait._launch(callback);

        }, 0);

    })();

};

module.exports = Wait;