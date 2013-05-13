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


//var arr = [12,45,78];
//var obj = { q: 12, w: '45', k: [1,3] };
//
//dump.info($tubur.utils.delByVal(arr, 45), arr);
//dump.info($tubur.utils.delByVal(obj, '45'), obj);
//
//var e204 = new $tubur.error.E204('Всё пропало шеф!');
//var e202 = new $tubur.error.E202('Всё пропало шеф!');
//
//dump.info(e204 instanceof $tubur.error.E204);

//dump.info(e202.getDescription());
//function Der() {
//    throw new $tubur.error.E204('Всё пропало шеф!');
//}

//Der();

//function XStruct() {
//
//    this.CdnNmb = new fields.Field({ required: true, type: "number", alias: 'cdnNmb', choices: [12,56] });
//    this.CdnRequestData = new fields.Field({ required: false, type: "string", alias: 'cdnRequestData' });
//
//    XStruct.super_.apply(this, arguments);
//}
//$util.inherits(XStruct, EasyStructure);


var validator1 = new EasyStructure();
var validator2 = new EasyStructure({

    ddd1: { type: 'number', required: true },

    hhh1: { type: {

        ppp2: { type: 'string', require: true }

    }, required: true }



});

//validator1
//    .addField('ddd1',{ required: true, type: 'object' })
//    .addField('kkk1', { required: true, type: 'string' });

validator2
    .addField('ddd2',{ required: true, type: 'object' })
    .addField('kkk2', { required: true, type: 'string' });

//dump.info(validator1.isValid({ kkk1: 45 }), validator1.getError(), validator1.toObject());
dump.info(validator2.isValid(), validator2.getError(), validator2.toObject());

//
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
//                ok(new $tubur.error.AccessError(null, 'Ошибочко вышло!'));
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
//        if (err) dump.error(err);
//        dump.info('END');
//
//    });