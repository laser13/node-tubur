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
    var _wait = this,
        args = Array.prototype.slice.call(arguments),
        options = args.pop() || {};

    // Название блока заданий
    options.label = options.label || 'JOB' + _serializer.randomString(32);

    // Время жизни заданий, по умолчанию 5 секунд. 0 - без времени жизни
    options.vita = options.vita || 5000;

    // Ключ остановки заданий
    options.stop = _serializer.randomString(32);

    // Интервал проверки выполнения заданий
    options.interval = options.interval || 0;

    // Логирование заданий и ожиданий
    options.log = options.log || false;

    this.options = options;
    this.jobs = args || [];

    this.check = function()
    {
        return (_wait.jobs.length == 0);
    }

};

/**
 * Останавливает весь процесс выполнения работ
 */
Wait.prototype.stop = function()
{
    this.check = function()
    {
        return this.options.stop;
    }
};

/**
 * Добавляет новое задание
 *
 * @param job
 * @returns {*}
 */
Wait.prototype.add = function(job)
{
    job = job || _serializer.randomString(64);

    if (typeof job === "function")
    {
        job();
    }
    if (typeof job === "string")
    {
        this.jobs.push(job);
        return job;
    }

};

Wait.prototype.ok = function(key)
{
    this.items.remove(key);
};

Wait.prototype.run = function(callback)
{
    var _wait = this;

    (function loop(){

        setTimeout(function() {

            if (_wait.options.log) console.log(_wait.options.label, _wait.check(), new Date().getTime());

            if (_wait.check() == _wait.options.stop) return ;

            if ( !(_wait.check()) ) return setTimeout(loop, _wait.options.interval);

            callback();

        }, 0);

    })();
};

module.exports = Wait;