/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 12.03.13 --- 17:01
 *
 * E = mc^2
 */

var _tubur = require('./../index'),
    _util = require('util');

global.dump = _tubur.utils.dump;

var wait = new _tubur.Wait({
    interval: 1000,
    log: false
});

var xxx = function(title, interval, callback) {

    setTimeout(function() {

        callback(title);

    }, interval);

};

wait.heap(function(ok) {

    dump('Старт XXX-1 3 сек.');
    xxx('XXX-1', 3000, function(title) {

        console.log(title);
        ok();

    });

}, function(ok) {

    dump('Старт XXX-2 6 сек.');
    xxx('XXX-2', 6000, function(title) {

        console.log(title);
        ok();

    });

}, function(ok) {

    dump('Старт XXX-3 12 сек.');
    xxx('XXX-3', 12000, function(title) {

        console.log(title);
        ok();

    });

});

wait.turn(function(ok) {

    dump('Старт XXX-4 5сек.');
    xxx('XXX-4', 5000, function(title) {

        console.log(title);
        ok();

    });

}, function(ok) {

    dump('Старт XXX-5 5 сек.');
    xxx('XXX-5', 5000, function(title) {

        console.log(title);
        ok();

    });

});

wait.run(function() {

    dump('FINISH');

});
