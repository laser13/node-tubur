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
    should = require('should'),
    assert = require("assert"),

    fields = tubur.fields,
    LasyStructure = tubur.LazyStructure,

    __$__;

global.dump = new tubur.utils.Logger({ colors: true });

var StructNumber = new LasyStructure({

//    field1: new fields.Field({ type: 'number' }),
//    field2: new fields.Field({ type: 'number', required: true }),

//    field3: new fields.Field({ type: 'number[]' }),
//    field4: new fields.Field({ type: 'number[]', required: true }),

//    field5: new fields.NumberField({ required: true }),
    field6: new fields.NumberField({ type: 'Array' }),

//    field7: new fields.PositiveNumberField(),
    field8: new fields.PositiveNumberField({ type: 'Array' })

}, 'StructNumber');

var structNumber = new StructNumber({

//    field1: 25,
//    field2: 26,
//
//    field3: 25,
//    field4: 25,
//
//    field5: 'wert',
    field6: ['wert', 56],

//    field7: 25,
    field8: 25

});

dump.info(structNumber.isValid());
dump.error(structNumber.getErrors());
dump.notice(structNumber.toObject());