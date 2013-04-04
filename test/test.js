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

global.dump = new tubur.utils.Logger({ colors: true });

var TestStructure2 = new LasyStructure({

    Huk: new Field({ type: 'number[]', required: true }),
    EndDate: new Field({ type: 'Date', required: true })

});

var TestStructure4 = new LasyStructure({

    Nmb: new Field({ type: 'number[]', required: true }),
    StartDate: new Field({ type: 'Date[]' }),
    Porte: new Field({ type: 'object[]', instance: TestStructure2 })

});

function SettingsUpdate ()
{
    this.ShowCnt  = new tubur.Field({ type: 'number', default: 0 });
    this.ClickCnt = new tubur.Field({ type: 'number', default: 0 });
    this.Budget   = new tubur.Field({ type: 'number', default: 0 });
    this.Price    = new tubur.Field({ type: 'number', default: 0 });

    SettingsUpdate.super_.apply(this, arguments);
}
util.inherits(SettingsUpdate, tubur.EasyStructure);

var textModel = new SettingsUpdate({});

//dump(textModel, 5);

dump.info('isValid: ', textModel.isValid());
dump.error('getErrors: ', textModel.getErrors());
dump.notice('toObject: ', textModel.toObject(), { depth: 0 });
