/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 08.04.13
 * Time: 11:14
 *
 * E = mc^2
 */

var tubur = require('./../index'),
    util = require('util'),
    should = require('should'),
    assert = require("assert"),

    fields = tubur.fields,

    __$__;

global.dump = new tubur.utils.Logger({ colors: true });

describe('Пакет /model/fields/field.js', function () {

    describe('number', function () {

        it('Не задано обязательное значение', function () {

            var fieldName = 'numField',
                fieldValue = 'wer',
                numberField = new fields.Field(fieldName, { type: 'number', required: true });

            numberField.set();

            var isValid = numberField.isValid();
            var errors = numberField.getErrors();
            var value = numberField.get();

            should.exist(isValid);
            isValid.should.be.a('boolean');
            isValid.should.be.equal(false);

            should.exist(errors);
            errors.should.be.an.instanceOf(Array);
            errors[0].type.should.be.equal('ValidationError');
            errors[0].info.field.should.be.equal(fieldName);
            should.not.exist(errors[0].info.value);
            errors[0].message.should.be.equal('required value');


            should.not.exist(value);

        });

        it('Вместо числа задана строка', function () {

            var fieldName = 'numField',
                fieldValue = 'wer',
                numberField = new fields.Field(fieldName, { type: 'number' });
            numberField.set(fieldValue);

            var isValid = numberField.isValid();
            var errors = numberField.getErrors();
            var value = numberField.get();

            should.exist(isValid);
            isValid.should.be.a('boolean');
            isValid.should.be.equal(false);

            should.exist(errors);
            errors.should.be.an.instanceOf(Array);
            errors[0].type.should.be.equal('ValidationError');
            errors[0].info.field.should.be.equal(fieldName);
            errors[0].info.value.should.be.equal(fieldValue);
            errors[0].message.should.be.equal('value must be of type number');


            should.not.exist(value);

        });

        it('Вместо числа задано число строкой', function () {

            var fieldName = 'numField',
                fieldValue = '125',
                numberField = new fields.Field(fieldName, { type: 'number' });

            numberField.set(fieldValue);

            var isValid = numberField.isValid();
            var errors = numberField.getErrors();
            var value = numberField.get();

//            should.exist(isValid);
//            isValid.should.be.a('boolean');
//            isValid.should.be.equal(false);
//
//            should.exist(errors);
//            errors.should.be.an.instanceOf(Array);
//            errors[0].type.should.be.equal('ValidationError');
//            errors[0].info.field.should.be.equal(fieldName);
//            errors[0].info.value.should.be.equal(fieldValue);
//            errors[0].message.should.be.equal('value must be of type number');
//
//
//            should.not.exist(value);

            dump.info(numberField.isValid());
            dump.error(numberField.getErrors());
            dump.info(numberField.get());

        });

    });

});