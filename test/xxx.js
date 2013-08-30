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

var dump = new $tubur.Collector({ colored: true, showStack: true, output: 'mongo', mongoUrl: 'mongodb://localhost:27030/dsp-log' });

var field = new fields.Field('Email', { type: 'mixed', required: true });

field.set();

dump.error(new $tubur.error.CustomError('MongoError', {}, 'Вот такая ошибка'));