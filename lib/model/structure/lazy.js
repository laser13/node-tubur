/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 30.03.13
 * Time: 12:30
 * To change this template use File | Settings | File Templates.
 */

var util = require('util'),

    EasyStructure = require('./easy'),

    fields = require('../fields'),

    __$__;

function CustomStructure()
{
    CustomStructure.super_.apply(this, arguments);
}
util.inherits(CustomStructure, EasyStructure);

function LazyStructure(fieldSet, name)
{

    var self = CustomStructure;

    for (var field in fieldSet)
    {
        if (fieldSet[field] instanceof fields.Field)
        {
            self[field] = fieldSet[field];
        }
        else
        {
            self[field] = new fields.Field(fieldSet[field]);
        }
    }

    self.prototype.name = name;

    return CustomStructure;

}

module.exports = LazyStructure;