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

    Field = tubur.Field,
    EasyStructure = tubur.EasyStructure,

    __$__;

global.dump = tubur.utils.dump;

function TestModel1(initial) {

    this.nmb = new Field({ type: 'number[]', required: true });
    this.name = new Field({ type: 'string', min: 5, max: 15, required: true });
    this.date = new Field({ type: 'Date' });
    this.xxx = new Field({ type: 'number', min: 5, max: 15, default: 0 });

    TestModel1.super_.call(this, initial);

}
util.inherits(TestModel1, EasyStructure);

function TestModel2(initial) {

    this.nmb = new Field({ type: 'number', required: true });
    this.test1 = new Field({ type: 'TestModel1', instance: TestModel1, required: true });

    TestModel2.super_.call(this, initial);

}
util.inherits(TestModel2, EasyStructure);

function TestModel3(initial) {

    this.nmb = new Field({ type: 'number', required: true });
    this.test1 = new Field({ type: 'Array', instance: TestModel1, required: false });
//    this.test2 = new Field({ type: 'object', instance: TestModel2, required: true });

    TestModel3.super_.call(this, initial);

}
util.inherits(TestModel3, EasyStructure);

var textModel = new TestModel3({

    nmb: 24,
    test1: [
        { nmb: [56] },
        { nmb: 389 }
    ]

});

dump('isValid: ', textModel.isValid(), 0);
dump('getErrors: ', textModel.getErrors(), 4);
dump('toObject: ', textModel.toObject(), 2);
