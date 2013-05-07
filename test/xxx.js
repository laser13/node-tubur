/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 12.03.13 --- 17:01
 *
 * E = mc^2
 */

var tubur = require('./../index'),
    $util = require('util'),

    fields = tubur.fields,
    EasyStructure = tubur.EasyStructure,

    Collector = require('../lib/collector'),

    wait = new tubur.Wait({ vita: 12 * 1000, log: false }),

    __$__;

global.dump = new tubur.Collector({ colored: true });

function XStruct() {

    this.CdnNmb = new fields.Field({ required: true, type: "number", alias: 'cdnNmb' });
    this.CdnRequestData = new fields.Field({ required: false, type: "string", alias: 'cdnRequestData' });

    XStruct.super_.apply(this, arguments);
}
$util.inherits(XStruct, tubur.EasyStructure);

var x = new XStruct({ cdnNmb: 45, cdnRequestData: 'werty' });

dump.info(x, '++++++++++++++++++', x.toObject());


//wait.turn(function(ok) {
//
//    var i = 0;
//    var si = setInterval(function() {
//
//        console.log('1-' + i);
//        i++;
//
//        if (i > 7) {
//            clearInterval(si);
//            ok(321);
//        }
//
//    }, 1000);
//
//});
//
//wait.turn(function(ok) {
//
//    var i = 0;
//    var si = setInterval(function() {
//
//        console.log('2-' + i);
//        i++;
//
//        if (i > 7) {
//            clearInterval(si);
//            ok(123);
//        }
//
//    }, 500);
//
//});
//
//wait.run(function(err) {
//
//    if (err) dump.error(err);
//    dump.info('end');
//
//});