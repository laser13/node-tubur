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

    __$__;

global.dump = new tubur.Collector({ colored: true });

function F1() {

    this.num = new fields.Field({ type: 'number' });
    this.country = new fields.StringField({ type: 'Array', required: true, correct: true, default: 'ertyu' });
    this.em = new fields.EmailField({ required: true });

    F1.super_.apply(this, arguments);

}
util.inherits(F1, EasyStructure);

function F2() {

    this.city = new fields.Field({ type: 'object[]', instance: F1, required: true, correct: true, default: new F1().toObject() });

    F2.super_.apply(this, arguments);

}
util.inherits(F2, EasyStructure);

var o1 = new F1({
    num: '4575',
    country: 34,
    em: '123@tyu.ui'
});
var o2 = new F1({ f1: { www: 34 } });

//dump.error(o1.getErrors(), o1.isValid(), o1.toObject(), { color: 'cyan' });
//dump.info(o2.getErrors(), o2.isValid(), o2.toObject());

var a = { www: { qqq: 123, ttt: 321 }, ppp: { qqq: { fff: 987, ppp: { kkk: { ggg: [985677, 'fdfsdfs', new Date()] } } } }, iii: [123456, 'fdfsdfs', new Date()] };
var err = new tubur.error.SystemError(a, 'Кто здесь?');
var dt = new tubur.DateTime();
//dump.info(tubur.utils.isError(err), tubur.utils.isInstanceOf(err, Error), tubur.utils.isTuburError(err), tubur.utils.isSystemError(err), tubur.utils.isUnknownError(err));
dump.info(dt.format('%y-%m-%d %H:%i:%s.%u'));
//throw err;