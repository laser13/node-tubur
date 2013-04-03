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
    LasyStructure = tubur.LazyStructure,

    __$__;

global.dump = new tubur.utils.Log({ colors: true, title: 'ERROR' });

var TestStructure2 = new LasyStructure({

    Huk: new Field({ type: 'number[]', required: true }),
    EndDate: new Field({ type: 'Date', required: true })

});

var TestStructure4 = new LasyStructure({

    Nmb: new Field({ type: 'number[]', required: true }),
    StartDate: new Field({ type: 'Date[]' }),
    Porte: new Field({ type: 'object[]', instance: TestStructure2 })

});

var textModel = new TestStructure4({

    Nmb: [24],
    StartDate: [new Date()],
    Porte: [
        {
            Huk: [67],
            EndDate: new Date()
        },
        {
            Huk: [6,7],
            EndDate: new Date()
        }
    ]

});

//dump(textModel, 5);

dump('isValid: ', textModel.isValid());
dump('getErrors: ', textModel.getErrors());
dump('toObject: ', textModel.toObject(), { depth: 0 });
