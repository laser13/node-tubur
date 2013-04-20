/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 20.04.13 14:19
 *
 * E = mc^2
 */

var $util = require('util'),
    $fs = require('fs'),
    $clc = require('cli-color'),
    utils = require('./utils'),
    EasyStructure = require('./model/structure/easy'),
    fields = require('./model/fields/index'),

    lineT = "========================================================================================================================",
    lineB = "========================================================================================================================",
    lineV = "=",
    lineLen = 120,

    __endvars__;

function ScribeOptStruct()
{
    this.output         = new fields.StringField({ default: 'console', choices: [ 'console', 'file' ] });
    this.path           = new fields.StringField();
    this.fileName       = new fields.StringField();
    this.showCodeLine   = new fields.Field({ type: 'boolean', default: false });
    this.showStack      = new fields.Field({ type: 'boolean', default: false });
    this.showHead       = new fields.Field({ type: 'boolean', default: false });
    this.showHidden     = new fields.Field({ type: 'boolean', default: false });
    this.headTitle      = new fields.StringField();
    this.color          = new fields.StringField({ default: 'none', choices: ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'black', 'none'] });
    this.colored        = new fields.Field({ type: 'boolean', default: false });
    this.depth          = new fields.PositiveNumberField({ default: 4 });

    ScribeOptStruct.super_.apply(this, arguments);
}
$util.inherits(ScribeOptStruct, EasyStructure);

function ScribeStruct()
{
    this.name = new fields.StringField({ require: true });
    this.options = new fields.Field({ type: 'object', instance: ScribeOptStruct, required: true });

    ScribeStruct.super_.apply(this, arguments);
}
$util.inherits(ScribeStruct, EasyStructure);

function CollectorOptionStruct()
{
    this.output = new fields.StringField({ default: 'console', choices: [ 'console', 'file' ] });
    this.path = new fields.StringField();
    this.colored = new fields.Field({ type: 'boleat', default: false });
    this.scribeSet = new fields.Field({ type: 'object[]', instance: ScribeStruct });

    CollectorOptionStruct.super_.apply(this, arguments);
}
$util.inherits(CollectorOptionStruct, EasyStructure);

function Scribe(options)
{
    var scribeOptStruct = new ScribeOptStruct(options);
    if (scribeOptStruct.hasErrors()) {
        (scribeOptStruct.getErrors()).forEach(function(err) {
            throw new Error().message = $util.inspect(err);
        });
    }

    options = scribeOptStruct.toObject();

    return function()
    {
        var args = Array.prototype.slice.call(arguments),
            header = '',
            stack = '',
            codeLine = '',
            str = '';

        if (args.length > 1)
        {
            var last = args[args.length - 1],
                pop = false;

            if (last && typeof last === "object")
            {
                var pop = false;
                if ( utils.hasKey(last, 'depth') ) { options.depth = last.depth; pop = true; }
                if ( utils.hasKey(last, 'showHidden') ) { options.showHidden = last.showHidden; pop = true; }
                if ( utils.hasKey(last, 'showStack') ) { options.showStack = last.showStack; pop = true; }
                if ( utils.hasKey(last, 'showCodeLine') ) { options.showCodeLine = last.showCodeLine; pop = true; }
                if ( utils.hasKey(last, 'headTitle') ) { options.headTitle = last.headTitle; pop = true; }
                if ( utils.hasKey(last, 'color') ) { options.color = last.color; pop = true; }
                if ( utils.hasKey(last, 'output') ) { options.output = last.output; pop = true; }
                if ( utils.hasKey(last, 'fileName') ) { options.fileName = last.fileName; pop = true; }
                if (pop) args.pop();
            }
        }

        if (options.output == 'file')
        {
            options.color = 'none';
            options.colored = false;
        }

        if (options.color != 'none') options.colored = true;



        if (options.showStack || options.showCodeLine)
        {
            var err = new Error;
            err.name = 'Trace';
            err.message = 'Error';
            Error.captureStackTrace(err, arguments.callee);

            if (options.showStack) stack = err.stack.trim() + "\n";
            if (options.showCodeLine) codeLine = err.stack.split("\n")[1].trim() + "\n";
        }

        if (options.showHead)
        {
                var str1 = lineV + '  ' + new Date().toLocaleString() + ' - ' + options.headTitle;
                var end1 = []; end1.length = 120 - str1.length; end1 = end1.join(' ') + lineV;

                header = "\n" + lineT + "\n" + str1 + end1 + "\n" + lineB + "\n";

            if (options.colored)
            {
                header = $clc[options.color](header);
                if (options.showStack) stack = $clc[options.color](stack);
                if (options.showCodeLine) codeLine = $clc[options.color](codeLine);
            }

        }

        str = header + codeLine + stack;

        args.forEach(function(v) {
            str += "\n" + $util.inspect(v, options.showHidden, options.depth, options.colored);
        });

        if (options.output == 'console') console.log(str);
        if (options.output == 'file' && options.path)
        {
            var stream = $fs.createWriteStream(options.path + '/' + (options.fileName + '.log' || 'scribe.log'), { flags: 'a', encoding: 'utf-8', mode: '0666' });
            stream.write(str + "\n");
            stream.end();
        }

    }
}

function Collector(options)
{
    var collectorOptionStruct = new CollectorOptionStruct(options);
    if (collectorOptionStruct.hasErrors()) {
        (collectorOptionStruct.getErrors()).forEach(function(err) {
            throw new Error().message = $util.inspect(err);
        });
    }

    options = collectorOptionStruct.toObject();

    if ( !utils.hasKey(options, 'scribeSet') )
    {
        var defaultScribeSet = [];
        if (options.colored)
        {
            defaultScribeSet =
                [
                    new ScribeStruct({ name: 'info', options: new ScribeOptStruct({ showHead: true, headTitle: '[ INFO ]', color: 'blue', colored: options.colored, output: options.output, path: options.path, fileName: 'info' }).toObject() }).toObject(),
                    new ScribeStruct({ name: 'notice', options: new ScribeOptStruct({ showHead: true, headTitle: '[ NOTICE ]', color: 'yellow', colored: options.colored, output: options.output, path: options.path, fileName: 'notice' }).toObject() }).toObject(),
                    new ScribeStruct({ name: 'error', options: new ScribeOptStruct({ showHead: true, headTitle: '[ ERROR ]', color: 'red', colored: options.colored, output: options.output, path: options.path, fileName: 'error', showCodeLine: true }).toObject() }).toObject(),
                    new ScribeStruct({ name: 'add', options: new ScribeOptStruct({ showHead: false, colored: options.colored, output: options.output, path: options.path, fileName: 'info' }).toObject() }).toObject()
                ];
        }
        else
        {
            defaultScribeSet =
                [
                    new ScribeStruct({ name: 'info', options: new ScribeOptStruct({ showHead: true, headTitle: '[ INFO ]', colored: options.colored, output: options.output, path: options.path, fileName: 'info' }).toObject() }).toObject(),
                    new ScribeStruct({ name: 'notice', options: new ScribeOptStruct({ showHead: true, headTitle: '[ NOTICE ]', colored: options.colored, output: options.output, path: options.path, fileName: 'notice' }).toObject() }).toObject(),
                    new ScribeStruct({ name: 'error', options: new ScribeOptStruct({ showHead: true, headTitle: '[ ERROR ]', colored: options.colored, output: options.output, path: options.path, fileName: 'error', showCodeLine: true }).toObject() }).toObject(),
                    new ScribeStruct({ name: 'add', options: new ScribeOptStruct({ showHead: false, colored: options.colored, output: options.output, path: options.path, fileName: 'info' }).toObject() }).toObject()
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