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
    underscore = require('underscore'),
    should = require('should'),
    assert = require("assert"),

    fields = tubur.fields,
    LazyStructure = tubur.LazyStructure,
    EasyStructure = tubur.EasyStructure,

    __$__;

global.dump = new tubur.utils.Logger({ colors: true });

function F1() {

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
    country: 34,
    em: '123@tyu.ui'
});
var o2 = new F1({ f1: { www: 34 } });

dump.error(o1.getErrors(), o1.isValid(), o1.toObject(), { color: 'cyan' });
//dump.info(o2.getErrors(), o2.isValid(), o2.toObject());