/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 12.03.13 --- 17:01
 *
 * E = mc^2
 */

var tubur = require('./../index'),
    util = require('util'),

    fields = tubur.fields,
    EasyStructure = tubur.EasyStructure,

    Collector = require('../lib/collector'),

    wait = new tubur.Wait({ vita: 12 * 1000, log: false }),

    __$__;

global.dump = new tubur.Collector({ colored: true });


wait.turn(function(ok) {

    var i = 0;
    var si = setInterval(function() {

        console.log('1-' + i);
        i++;

        if (i > 7) {
            clearInterval(si);
            ok(321);
        }

    }, 1000);

});

wait.turn(function(ok) {

    var i = 0;
    var si = setInterval(function() {

        console.log('2-' + i);
        i++;

        if (i > 7) {
            clearInterval(si);
            ok(123);
        }

    }, 500);

});

wait.run(function(err) {

    if (err) dump.error(err);
    dump.info('end');

});