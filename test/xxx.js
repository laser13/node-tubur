/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 12.03.13 --- 17:01
 *
 * E = mc^2
 */

var $tubur = require('./../index'),
    $util = require('util'),

    fields = $tubur.fields,
    EasyStructure = $tubur.EasyStructure,

    Collector = require('../lib/collector'),

    wait = new $tubur.Wait({ vita: 12 * 1000, log: false }),

    __$__;

global.dump = new $tubur.Collector({ colored: true });

var e204 = new $tubur.error.E204('Всё пропало шеф!');
var e202 = new $tubur.error.E202('Всё пропало шеф!');

//dump.info(e202.getDescription());
function Der() {
    throw new $tubur.error.E204('Всё пропало шеф!');
}

Der();

//function XStruct() {
//
//    this.CdnNmb = new fields.Field({ required: true, type: "number", alias: 'cdnNmb', choices: [12,56] });
//    this.CdnRequestData = new fields.Field({ required: false, type: "string", alias: 'cdnRequestData' });
//
//    XStruct.super_.apply(this, arguments);
//}
//$util.inherits(XStruct, EasyStructure);
//
//
//var validator = new EasyStructure();
//
//validator
//    .addField('ddd', { required: true, type: "number" })
//    .addField('kkk', { required: true, type: "string" });
//
//dump.info(validator.isValid({ ddd: '45' }), validator.getError(), validator.toObject());
//
//var xStruct = new XStruct({});
//
//dump.info(xStruct.isValid(), xStruct.getError());


//wait
//    .turn(function(ok) {
//
//        var i = 0;
//        var si = setInterval(function() {
//
//            console.log('1-' + i);
//            i++;
//
//            if (i > 3) {
//                clearInterval(si);
//                wait.stop(321);
//            }
//
//        }, 1000);
//
//    })
//    .turn(function(ok) {
//
//        var i = 0;
//        var si = setInterval(function() {
//
//            console.log('2-' + i);
//            i++;
//
//            if (i > 7) {
//                clearInterval(si);
//                ok(123);
//            }
//
//        }, 500);
//
//    })
//    .run(function(err) {
//
//    if (err) dump.error(err);
//    dump.info('END');
//
//});