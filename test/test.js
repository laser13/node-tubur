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

var X1 = new LasyStructure({

    www: new tubur.fields.Field({ type: 'string', required: true }),
    ddd: new tubur.fields.Field({ type: 'number[]', required: true })

});

var X2 = new LasyStructure({

    bbb: new tubur.fields.Field({ type: 'object[]', instance: X1, required: true })

});

var x11 = new X2({

    bbb: [{}, 67]

});

var x12 = new X1({



});

//dump.info(x2.isValid());
dump.error(x11.getErrors());
//dump.error(x12.getErrors());