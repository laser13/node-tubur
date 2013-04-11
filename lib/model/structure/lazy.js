/**
 * Created with JetBrains PhpStorm.
 * User: laser13
 * Date: 30.03.13
 * Time: 12:30
 * To change this template use File | Settings | File Templates.
 */

var util = require('util'),

    EazyStructure = require('./eazy'),

    fields = require('../fields'),

    __$__;

function LazyStructure(fieldSet, name)
{
    name = name || 'EazyStructure';

    function CustomStructure()
    {
        var self = this;

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

        CustomStructure.super_.apply(this, arguments);
    }
    util.inherits(CustomStructure, EazyStructure);

    return CustomStructure;

}

module.exports = LazyStructure;