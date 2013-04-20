/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.04.13 23:24
 *
 * E = mc^2
 */

var $tubur = require('../../index'),
    $should = require('should'),

    utils = $tubur.utils,

    __endvars__;

describe('тестируем другие функции', function() {

        it('rnd', function() {

            utils.rnd(1,3).should.be.within(1, 3);

        });

});