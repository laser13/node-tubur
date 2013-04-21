/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 21.04.13 11:20
 *
 * E = mc^2
 */

var $tubur = require('../../../index'),
    $should = require('should'),

    Field = $tubur.fields.Field,
    error = $tubur.error,

//    dump = new $tubur.Collector({ colored: true }),

    __endvars__;

describe('тестируем класс Field', function() {

    describe('тестируем SystemError', function() {

        var field1 = new Field({ required: true });
        var field2 = new Field();

        it('Не задано значение', function() {

//            console.log("\n==========================================");

            field1.isValid().should.be.a('boolean').and.not.be.ok;
            field1.getErrors().should.be.an.instanceOf(Array);
            field1.getErrors()[0].should.be.an.instanceOf(error.SystemError);
            field1.getErrors()[0]['message'].should.equal('not called method "set"');
            $should.not.exist(field1.get());

            field2.isValid().should.be.a('boolean').and.not.be.ok;
            field2.getErrors().should.be.an.instanceOf(Array);
            field2.getErrors()[0].should.be.an.instanceOf(error.SystemError);
            field2.getErrors()[0]['message'].should.equal('not called method "set"');
            $should.not.exist(field2.get());

//            console.log(field1.isValid(), field1.getErrors(), field1.get());
//            console.log(field2.isValid(), field2.getErrors(), field2.get());
//            console.log("\n==========================================\n");

        });

        it('Не задано имя', function() {



        });

    });

    describe('тестируем ограничения', function() {

        it('R E Q U I R E D', function() {

            var field1 = new Field('fieldName1', { required: true });
            var field2 = new Field('fieldName2');

            field1.set();
            field2.set();

            field1.isValid().should.be.a('boolean').and.not.be.ok;
            field1.getErrors().should.be.an.instanceOf(Array);
            field1.getErrors()[0].should.be.an.instanceOf(error.ValidationError);
            field1.getErrors()[0]['message'].should.equal('required value');
            $should.not.exist(field1.get());

            field2.isValid().should.be.a('boolean').and.be.ok;
            field2.getErrors().should.be.an.instanceOf(Array);
            field2.getErrors().should.be.empty;
            $should.not.exist(field2.get());

        });

    });

    describe('тестируем type', function() {

        describe('S T R I N G', function() {

            describe.only('нестрогая проверка', function() {

                var field = new Field('fieldName', { type: 'string', required: true });

                it('пустая строка ""', function() {

                    field.set("");
                    console.log(field.getErrors());

                    field.isValid().should.be.a('boolean').and.be.ok;
                    field.getErrors().should.be.an.instanceOf(Array);
                    field.getErrors().should.be.empty;
                    field.get().should.equal("");

                });

                it('число 123', function() {

                    field.set(123);

                    field.isValid().should.be.a('boolean').and.be.ok;
                    field.getErrors().should.be.an.instanceOf(Array);
                    field.getErrors().should.be.empty;
                    field.get().should.equal('123');

                });

                it('число 1.23', function() {

                    field.set(1.23);

                    field.isValid().should.be.a('boolean').and.be.ok;
                    field.getErrors().should.be.an.instanceOf(Array);
                    field.getErrors().should.be.empty;
                    field.get().should.equal('1.23');

                });

                it('дата new Date()', function() {

                    var date = new Date();

                    field.set(date);
//                    console.log(field.getErrors());

                    field.isValid().should.be.a('boolean').and.not.be.ok;
                    field.getErrors().should.be.an.instanceOf(Array);
                    field.getErrors().should.not.be.empty;
                    field.getErrors()[0].should.be.an.instanceOf(error.ValidationError);
                    field.getErrors()[0]['message'].should.equal('value must be of type string');
                    field.getErrors()[0]['info']['field'].should.equal('fieldName');
                    field.getErrors()[0]['info']['value'].should.equal(date);
                    $should.not.exist(field.get());

                });

                it('массив []', function() {

                    field.set([]);
//                    console.log(field.getErrors());

                    field.isValid().should.be.a('boolean').and.not.be.ok;
                    field.getErrors().should.be.an.instanceOf(Array);
                    field.getErrors().should.not.be.empty;
                    field.getErrors()[0].should.be.an.instanceOf(error.ValidationError);
                    field.getErrors()[0]['message'].should.equal('value must be of type string');
                    field.getErrors()[0]['info']['field'].should.equal('fieldName');
                    field.getErrors()[0]['info']['value'].should.eql([]);
                    $should.not.exist(field.get());

                });

                it('объект {}', function() {

                    field.set([]);
//                    console.log(field.getErrors());

                    field.isValid().should.be.a('boolean').and.not.be.ok;
                    field.getErrors().should.be.an.instanceOf(Array);
                    field.getErrors().should.not.be.empty;
                    field.getErrors()[0].should.be.an.instanceOf(error.ValidationError);
                    field.getErrors()[0]['message'].should.equal('value must be of type string');
                    field.getErrors()[0]['info']['field'].should.equal('fieldName');
                    field.getErrors()[0]['info']['value'].should.eql({});
                    $should.not.exist(field.get());

                });

            });

        });

    });

});