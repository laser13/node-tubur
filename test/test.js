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

var TestModel = function(initial) {

    this.nmb = new Field({ type: 'number', required: true });
    this.name = new Field({ type: 'string', min: 5, max: 15 });
    this.date = new Field({ type: 'Date' });
    this.xxx = new Field({ type: 'number', min: 5, max: 15 });

    TestModel.super_.call(this, initial);

};
util.inherits(TestModel, EasyStructure);


var textModel = new TestModel({

    nmb: 25,
    name: 'Dasher',
    date: new Date

});

dump(textModel.isValid(), 0);
dump(textModel.getErrors(), 4);
dump(textModel.toObject(), 2);
