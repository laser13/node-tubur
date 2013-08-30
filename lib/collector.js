/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.04.13 14:19
 *
 * E = mc^2
 */

var $util = require('util');
var $fs = require('fs');
var $os = require('os');
var $path = require('path');
var $clc = require('cli-color');
var MongoClient = require('mongodb').MongoClient;
var utils = require('./utils');
var EasyStructure = require('./model/structure/easy');
var fields = require('./model/fields/index');

var lineT = "========================================================================================================================";
var lineB = "========================================================================================================================";
var lineV = "=";
var lineLen = 120;

function ScribeOptStruct() {

    this.output         = new fields.StrField({ default: 'console', choices: [ 'console', 'file', 'mongo' ] });
    this.path           = new fields.StrField();
    this.fileName       = new fields.StrField();
    this.mongoUrl       = new fields.StrField();
    this.collectionName = new fields.StrField();
    this.showCodeLine   = new fields.Field({ type: 'boolean', default: false });
    this.showStack      = new fields.Field({ type: 'boolean', default: false });
    this.showHead       = new fields.Field({ type: 'boolean', default: false });
    this.showHidden     = new fields.Field({ type: 'boolean', default: false });
    this.headTitle      = new fields.StrField();
    this.color          = new fields.StrField({ default: 'none', choices: ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'black', 'none'] });
    this.colored        = new fields.Field({ type: 'boolean', default: false });
    this.depth          = new fields.PosNumField({ default: 8 });
    ScribeOptStruct.super_.apply(this, arguments);
}
$util.inherits(ScribeOptStruct, EasyStructure);

function ScribeStruct() {
    this.name       = new fields.StrField({ require: true });
    this.options    = new fields.Field({ type: 'object', instance: ScribeOptStruct, required: true });
    ScribeStruct.super_.apply(this, arguments);
}
$util.inherits(ScribeStruct, EasyStructure);

function CollectorOptionStruct() {

    this.output     = new fields.StrField({ default: 'console', choices: [ 'console', 'file', 'mongo' ] });
    this.mongoUrl   = new fields.StrField();
    this.path       = new fields.StrField();
    this.colored    = new fields.Field({ type: 'boolean', default: false });
    this.showStack  = new fields.Field({ type: 'boolean', default: false });
    this.showCodeLine = new fields.Field({ type: 'boolean', default: false });
    this.scribeSet  = new fields.Field({ type: 'object[]', instance: ScribeStruct });
    CollectorOptionStruct.super_.apply(this, arguments);
}
$util.inherits(CollectorOptionStruct, EasyStructure);

function Scribe(options) {

    var scribeOptStruct = new ScribeOptStruct(options);
    if (scribeOptStruct.hasError()) {
        (scribeOptStruct.getError()).forEach(function(err) {
            throw new Error().message = $util.inspect(err);
        });
    }

    if (options.path) utils.createDirReq(options.path);

    return function() {

        var options = utils.clone(scribeOptStruct.toObject());
        var args = Array.prototype.slice.call(arguments);
        var header = '';
        var stack = '';
        var codeLine = '';
        var str = '';

        if (args.length > 1) {
            var last = args[args.length - 1];
            var pop = false;

            if (last && typeof last === "object") {
                pop = false;
                if ( utils.hasKey(last, 'depth') ) { options.depth = last.depth; pop = true; }
                if ( utils.hasKey(last, 'showHidden') ) { options.showHidden = last.showHidden; pop = true; }
                if ( utils.hasKey(last, 'showStack') ) { options.showStack = last.showStack; pop = true; }
                if ( utils.hasKey(last, 'showCodeLine') ) { options.showCodeLine = last.showCodeLine; pop = true; }
                if ( utils.hasKey(last, 'headTitle') ) { options.headTitle = last.headTitle; pop = true; }
                if ( utils.hasKey(last, 'color') ) { options.color = last.color; pop = true; }
                if ( utils.hasKey(last, 'colored') ) { options.colored = last.colored; pop = true; }
                if ( utils.hasKey(last, 'output') ) { options.output = last.output; pop = true; }
                if ( utils.hasKey(last, 'collectionName') ) { options.collectionName = last.collectionName; pop = true; }
                if ( utils.hasKey(last, 'fileName') ) { options.fileName = last.fileName; pop = true; }
                if (pop) args.pop();
            }
        }

        if (options.output == 'file') {
            options.color = 'none';
            options.colored = false;
        }

        if (options.output == 'mongo') {
            options.color = 'none';
            options.colored = false;
            options.showHead = false;
        }

        if (options.colored == false) options.color = 'none';
        if (options.color != 'none') options.colored = true;

        if (options.showStack || options.showCodeLine) {
            var err = new Error;
            err.name = 'Trace';
            err.message = 'Error';
            Error.captureStackTrace(err, arguments.callee);

            if (options.showStack) stack = err.stack.trim() + "\n";
            if (options.showCodeLine) codeLine = '('+err.stack.split("\n")[1].split("(").pop().trim();
        }

        if (options.showHead) {
            var str1 = lineV + '  ' + new Date().toLocaleString() + ' - ' + options.headTitle;
            var end1 = []; end1.length = 120 - str1.length; end1 = end1.join(' ') + lineV;
            if (options.showCodeLine) {
                var end2 = []; end2.length = (117 - codeLine.length) >= 0 ? (117 - codeLine.length) : 0; end2 = end2.join(' ') + lineV;
                header = "\n" + lineT + "\n" + str1 + end1 + "\n" + lineV + '  ' + codeLine + end2 + "\n" + lineB + "\n";
            }
            else {
                header = "\n" + lineT + "\n" + str1 + end1 + "\n" + lineB + "\n";
            }

            if (options.colored) {
                header = $clc[options.color](header);
                if (options.showStack) stack = $clc[options.color](stack);
                if (options.showCodeLine) codeLine = $clc[options.color](codeLine);
            }
        }

        str = header + stack;

        var items = [];
        args.forEach(function(v) {
            if (options.output === 'mongo') {
                items.push(v);
            }
            else {
                items.push($util.inspect(v, options.showHidden, options.depth, options.colored));
            }
        });

        if (options.output === 'mongo') {
            str = items;
        }
        else {
            str += items.join("\n");
        }

        if (options.output == 'console') console.log(str);
        if (options.output == 'file' && options.path) {
            var stream = $fs.createWriteStream($path.normalize(options.path + '/' + (options.fileName + '.log' || 'scribe.log')), { flags: 'a', encoding: 'utf-8', mode: '0666' });
            stream.write(str + "\n", function(err) {
                if (err) {
                    console.log(err);
                    console.log(str);
                }
                stream.end();
            });
        }
        if (options.output === 'mongo' && options.mongoUrl) {

            MongoClient.connect(options.mongoUrl, {}, function(err, db) {

                if (err) {
                    console.log(err);
                    console.log(str);
                }

                if (str.length == 1) str = str[0];

                var collection = db.collection(options.collectionName || 'dump');
                var data = { date: new Date(), data: str, line: codeLine, host: $os.hostname() };

//                console.log(stack, str.stack);
                if (options.showStack) data['stack'] = stack.split("\n")
                    .map(function(el) { return el.trim(); })
                    .filter(function(el) { if (el) return true; });

                collection.insert(data, function(err, docs) {

                    if (err) {
                        console.log(err);
                        console.log(str);
                    }

                    db.close();
                });
            })
        }
        return str;
    }
}

function Collector(options) {

    var collectorOptionStruct = new CollectorOptionStruct(options);
    if (collectorOptionStruct.hasError()) {
        (collectorOptionStruct.getError().list).forEach(function(err) {
            throw new Error().message = $util.inspect(err);
        });
    }

    options = collectorOptionStruct.toObject();

    if ( !utils.hasKey(options, 'scribeSet') ) {
        var defaultScribeSet = [];
        if (options.colored) {
            defaultScribeSet = [
                new ScribeStruct({ name: 'info', options: new ScribeOptStruct({ showHead: true, headTitle: '[ INFO ]', color: 'blue', colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'info', fileName: 'info', showCodeLine: options.showCodeLine }).toObject() }).toObject(),
                new ScribeStruct({ name: 'notice', options: new ScribeOptStruct({ showHead: true, headTitle: '[ NOTICE ]', color: 'yellow', colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'notice', fileName: 'notice', showCodeLine: options.showCodeLine }).toObject() }).toObject(),
                new ScribeStruct({ name: 'error', options: new ScribeOptStruct({ showHead: true, headTitle: '[ ERROR ]', color: 'red', colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'error', fileName: 'error', showCodeLine: true, showStack: options.showStack }).toObject() }).toObject(),
                new ScribeStruct({ name: 'add', options: new ScribeOptStruct({ showHead: false, colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'info', fileName: 'info' }).toObject() }).toObject()
            ];
        }
        else {
            defaultScribeSet = [
                new ScribeStruct({ name: 'info', options: new ScribeOptStruct({ showHead: true, headTitle: '[ INFO ]', colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'info', fileName: 'info', showCodeLine: options.showCodeLine }).toObject() }).toObject(),
                new ScribeStruct({ name: 'notice', options: new ScribeOptStruct({ showHead: true, headTitle: '[ NOTICE ]', colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'notice', fileName: 'notice', showCodeLine: options.showCodeLine }).toObject() }).toObject(),
                new ScribeStruct({ name: 'error', options: new ScribeOptStruct({ showHead: true, headTitle: '[ ERROR ]', colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'error', fileName: 'error', showCodeLine: true, showStack: options.showStack }).toObject() }).toObject(),
                new ScribeStruct({ name: 'add', options: new ScribeOptStruct({ showHead: false, colored: options.colored, output: options.output, path: options.path, mongoUrl: options.mongoUrl, collectionName: 'info', fileName: 'info' }).toObject() }).toObject()
            ];
        }
        options.scribeSet = defaultScribeSet;
    }

    var scribeSet = {};
    options.scribeSet.forEach(function(scribe) {
        scribeSet[scribe.name] = new Scribe(scribe.options);
    });

    return scribeSet;
}

module.exports = Collector;