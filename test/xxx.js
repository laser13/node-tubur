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

    wait = new tubur.Wait({ vita: 5 * 1000 }),

    __$__;

global.dump = new tubur.Collector({ colored: true });


wait.heap(function(ok) {

    var i = 0;
    var si = setInterval(function() {

        console.log(i);
        i++;

        if (i > 6) {
            clearInterval(si);
            ok();
        }

    }, 1000);

});

wait.run(function(err) {

    if (err) dump.error(err);
    dump.info('end');

});