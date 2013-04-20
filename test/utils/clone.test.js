/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.04.13 22:40
 *
 * E = mc^2
 */

var $tubur = require('../../index'),
    $should = require('should'),

    utils = $tubur.utils,

    __endvars__;

describe('тестируем clone', function() {

    it('клонируем простой объект', function() {

        var date = new Date();
        var obj = { www1: 111, www2: '222', www3: date };
        var _obj = utils.clone(obj);

        _obj.should.be.a('object');
        _obj.should.have.property('www1', 111);
        _obj.should.have.property('www2', '222');
        _obj.should.have.property('www3', date);

        (_obj == obj).should.not.be.ok;

    });

    it('клонируем вложенный объект', function() {

        var date = new Date();
        var obj = {
            www1: {
                qqq1: 'qwerty',
                qqq2: {
                    vvv1: [1,2,3]
                }
            },
            www2: [
                {
                    ddd1: 222,
                    ddd2: [1,2,3]
                },
                25
            ],
            www3: date
        };
        var _obj = utils.clone(obj);

        _obj.should.be.a('object');
        _obj.should.have.property('www1').and.have.property('qqq1', 'qwerty');
        _obj.should.have.property('www1').and.have.property('qqq2').and.have.property('vvv1').with.lengthOf(3);

        _obj.should.have.property('www2').with.lengthOf(2);
        _obj.www2[0].should.have.property('ddd1', 222);

        _obj.should.have.property('www3', date);

        (_obj == obj).should.not.be.ok;
        (_obj.www1 == obj.www1).should.not.be.ok;
        (_obj.www2 == obj.www2).should.not.be.ok;
        (_obj.www3 == obj.www3).should.be.ok;

        (_obj.www1.qqq1 == obj.www1.qqq1).should.be.ok;
        (_obj.www1.qqq2 == obj.www1.qqq2).should.not.be.ok;
        (_obj.www1.qqq2.vvv1 == obj.www1.qqq2.vvv1).should.not.be.ok;

        (_obj.www2[0].ddd2 == obj.www2[0].ddd2).should.not.be.ok;

    });

});