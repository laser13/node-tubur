/**
 * ☭ Какой сам ☭
 * Author: Pavlenov Semen
 *
 * Date: 12.03.13 17:01
 *
 * E = mc^2
 */
var $tubur = require('./../index');
var $util = require('util');
var fields = $tubur.fields;
var EasyStructure = $tubur.EasyStructure;

var dump = new $tubur.Collector({ colored: true });

var field = new fields.EmailField('Email', { type: 'string[]', required: true });

field.set(['wer@te.we', 56]);

dump.error(field.getError(), field.get());