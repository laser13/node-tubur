/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.04.13 20:11
 *
 * E = mc^2
 */

var $tubur = require('../../index'),
    $should = require('should'),

    utils = $tubur.utils,

    __endvars__;

describe('тестируем блок is', function() {

    describe('простые значения', function() {

        it('isString', function() {

            utils.should.have.property('isString');
            utils.isString('').should.be.a('boolean').and.be.ok;
            utils.isString('0').should.be.a('boolean').and.be.ok;
            utils.isString('test').should.be.a('boolean').and.be.ok;
            utils.isString(1).should.be.a('boolean').and.not.be.ok;

        });

        it('isNumber', function() {

            utils.should.have.property('isNumber');
            utils.isNumber(1).should.be.a('boolean').and.be.ok;
            utils.isNumber(0).should.be.a('boolean').and.be.ok;
            utils.isNumber(0.5).should.be.a('boolean').and.be.ok;
            utils.isNumber(NaN).should.be.a('boolean').and.be.ok;
            utils.isNumber('0').should.be.a('boolean').and.not.be.ok;

        });

        it('isInteger', function() {

            utils.should.have.property('isInteger');
            utils.isInteger(0).should.be.a('boolean').and.be.ok;
            utils.isInteger(1).should.be.a('boolean').and.be.ok;
            utils.isInteger(NaN).should.be.a('boolean').and.not.be.ok;
            utils.isInteger('').should.be.a('boolean').and.not.be.ok;
            utils.isInteger(0.1).should.be.a('boolean').and.not.be.ok;
            utils.isInteger([]).should.be.a('boolean').and.not.be.ok;

        });

        it('isFloat', function() {

            utils.should.have.property('isFloat');
            utils.isFloat(1.12).should.be.a('boolean').and.be.ok;
            utils.isFloat(NaN).should.be.a('boolean').and.not.be.ok;
            utils.isFloat('').should.be.a('boolean').and.not.be.ok;
            utils.isFloat(1).should.be.a('boolean').and.not.be.ok;
            utils.isFloat([]).should.be.a('boolean').and.not.be.ok;

        });

        it('isBoolean', function() {

            utils.should.have.property('isBoolean');
            utils.isBoolean(true).should.be.a('boolean').and.be.ok;
            utils.isBoolean(false).should.be.a('boolean').and.be.ok;
            utils.isBoolean(NaN).should.be.a('boolean').and.not.be.ok;
            utils.isBoolean('').should.be.a('boolean').and.not.be.ok;
            utils.isBoolean(1).should.be.a('boolean').and.not.be.ok;
            utils.isBoolean([]).should.be.a('boolean').and.not.be.ok;

        });

    });

    describe('объекты', function() {

        it('isArray', function() {

            utils.should.have.property('isArray');
            utils.isArray([]).should.be.a('boolean').and.be.ok;
            utils.isArray([1,2,3]).should.be.a('boolean').and.be.ok;
            utils.isArray({}).should.be.a('boolean').and.not.be.ok;
            utils.isArray({ www: 123 }).should.be.a('boolean').and.not.be.ok;
            utils.isArray('test').should.be.a('boolean').and.not.be.ok;
            utils.isArray(1).should.be.a('boolean').and.not.be.ok;

        });

        it('isObject', function() {

            utils.should.have.property('isObject');
            utils.isObject({}).should.be.a('boolean').and.be.ok;
            utils.isObject({ www: 123 }).should.be.a('boolean').and.be.ok;

            utils.isObject([]).should.be.a('boolean').and.not.be.ok;
            utils.isObject(new Date()).should.be.a('boolean').and.not.be.ok;
            utils.isObject('test').should.be.a('boolean').and.not.be.ok;
            utils.isObject(1).should.be.a('boolean').and.not.be.ok;

        });

        it('isDate', function() {

            utils.should.have.property('isDate');
            utils.isDate(new Date).should.be.a('boolean').and.be.ok;
            utils.isDate(new Date(2013)).should.be.a('boolean').and.be.ok;

            utils.isDate([]).should.be.a('boolean').and.not.be.ok;
            utils.isDate(Date.now()).should.be.a('boolean').and.not.be.ok;
            utils.isDate('test').should.be.a('boolean').and.not.be.ok;
            utils.isDate(1).should.be.a('boolean').and.not.be.ok;
            utils.isDate({}).should.be.a('boolean').and.not.be.ok;

        });

        it('isFunction', function() {

            utils.should.have.property('isFunction');
            utils.isFunction(function() {}).should.be.a('boolean').and.be.ok;
            utils.isFunction(utils.isFunction).should.be.a('boolean').and.be.ok;

            utils.isFunction([]).should.be.a('boolean').and.not.be.ok;
            utils.isFunction(new Date()).should.be.a('boolean').and.not.be.ok;
            utils.isFunction('test').should.be.a('boolean').and.not.be.ok;
            utils.isFunction(1).should.be.a('boolean').and.not.be.ok;
            utils.isFunction({}).should.be.a('boolean').and.not.be.ok;

        });

    });

    describe('IP, Email, Url', function() {

        it('isEmail', function() {

            utils.should.have.property('isEmail');
            utils.isEmail('email@ooo.ru').should.be.a('boolean').and.be.ok;
            utils.isEmail('email123.pre@d.com').should.be.a('boolean').and.be.ok;

            utils.isEmail('e@u').should.be.a('boolean').and.not.be.ok;
            utils.isEmail('e@1').should.be.a('boolean').and.not.be.ok;
            utils.isEmail('test').should.be.a('boolean').and.not.be.ok;
            utils.isEmail(1).should.be.a('boolean').and.not.be.ok;
            utils.isEmail({}).should.be.a('boolean').and.not.be.ok;

        });

        it('isUrl', function() {

            utils.should.have.property('isUrl');
            utils.isUrl('ooo.ru').should.be.a('boolean').and.be.ok;
            utils.isUrl('http://d.com').should.be.a('boolean').and.be.ok;
            utils.isUrl('http://россия.рф').should.be.a('boolean').and.be.ok;

            utils.isUrl('http:/www.com').should.be.a('boolean').and.not.be.ok;
            utils.isUrl('e@1').should.be.a('boolean').and.not.be.ok;
            utils.isUrl('test').should.be.a('boolean').and.not.be.ok;
            utils.isUrl(1).should.be.a('boolean').and.not.be.ok;
            utils.isUrl({}).should.be.a('boolean').and.not.be.ok;

        });

        it('isIP4', function() {

            utils.should.have.property('isIP4');
            utils.isIP4('1.1.1.1').should.be.a('boolean').and.be.ok;
            utils.isIP4('0.0.0.0').should.be.a('boolean').and.be.ok;
            utils.isIP4('111.111.111.111').should.be.a('boolean').and.be.ok;

            utils.isIP4('333.333.333.333').should.be.a('boolean').and.not.be.ok;
            utils.isIP4('1.1.1').should.be.a('boolean').and.not.be.ok;
            utils.isIP4('1.1.1.1.1').should.be.a('boolean').and.not.be.ok;
            utils.isIP4(1).should.be.a('boolean').and.not.be.ok;
            utils.isIP4({}).should.be.a('boolean').and.not.be.ok;

        });

        it('isIP6', function() {

            utils.should.have.property('isIP6');
            utils.isIP6('2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d').should.be.a('boolean').and.be.ok;
            utils.isIP6('fe80::221:97ff:feed:ef01').should.be.a('boolean').and.be.ok;
            utils.isIP6('1:1:1:1:1:1:1:1').should.be.a('boolean').and.be.ok;

            utils.isIP6('333:333:333+333').should.be.a('boolean').and.not.be.ok;
            utils.isIP6('1.1.1').should.be.a('boolean').and.not.be.ok;
            utils.isIP6('1.1.1.1.1').should.be.a('boolean').and.not.be.ok;
            utils.isIP6('2001:0db8:11a3:09d7:1f34:8a2e:07a0:765m').should.be.a('boolean').and.not.be.ok;
            utils.isIP6({}).should.be.a('boolean').and.not.be.ok;

        });

    });

    describe('null, empty, undefined', function() {

        it('isUndefined', function() {

            utils.should.have.property('isUndefined');
            utils.isUndefined(undefined).should.be.a('boolean').and.be.ok;
            utils.isUndefined(utils.www).should.be.a('boolean').and.be.ok;

            utils.isUndefined('undefined').should.be.a('boolean').and.not.be.ok;
            utils.isUndefined(1).should.be.a('boolean').and.not.be.ok;

        });

        it('isNotUndefined', function() {

            utils.should.have.property('isNotUndefined');
            utils.isNotUndefined(undefined).should.be.a('boolean').and.not.be.ok;
            utils.isNotUndefined(utils.www).should.be.a('boolean').and.not.be.ok;

            utils.isNotUndefined('undefined').should.be.a('boolean').and.be.ok;
            utils.isNotUndefined(1).should.be.a('boolean').and.be.ok;

        });

        it('hasKey', function() {

            var obj = { www: { ddd: [123], aaa: { hhh: 123 } } };

            utils.should.have.property('hasKey');
            utils.hasKey(obj, 'www').should.be.a('boolean').and.be.ok;
            utils.hasKey(obj, 'www', ['ddd','aaa']).should.be.a('boolean').and.be.ok;
            utils.hasKey(obj, 'www', 'aaa', 'hhh').should.be.a('boolean').and.be.ok;

            utils.hasKey(obj, 'vvv').should.be.a('boolean').and.not.be.ok;
            utils.hasKey(obj, 'www', 'fff').should.be.a('boolean').and.not.be.ok;

        });

        it('isSet', function() {

            utils.should.have.property('isSet');
            utils.isSet(0).should.be.a('boolean').and.be.ok;
            utils.isSet('wer').should.be.a('boolean').and.be.ok;
            utils.isSet({ www:123 }).should.be.a('boolean').and.be.ok;
            utils.isSet([1]).should.be.a('boolean').and.be.ok;

            utils.isSet({}).should.be.a('boolean').and.not.be.ok;
            utils.isSet([]).should.be.a('boolean').and.not.be.ok;
            utils.isSet(NaN).should.be.a('boolean').and.not.be.ok;
            utils.isSet(undefined).should.be.a('boolean').and.not.be.ok;
            utils.isSet(utils.www).should.be.a('boolean').and.not.be.ok;

        });

    });

});