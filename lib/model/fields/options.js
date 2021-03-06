/**
 * Какой сам ⚝
 * Author: Pavlenov Semen
 * Date: 21.03.13
 * Time: 7:49
 *
 * E = mc^2
 */
var __options = module.exports = exports,

    key = {
        REQUIRED: 'required',
        TYPE: 'type',
        INSTANCE: 'instance',
        CHOICES: 'choices',
        MIN: 'min',
        MAX: 'max',
        RANGE: 'range',
        REGEXP: 'regexp',
        DEFAULT: 'default'
    },

    defaultErrorMsg =
    {
        required:   'required value',
        type:       'value must be of type %{option}',
        instance:   'value must be instance of %{option}',
        choices:    'value out of range [%{option}]',
        max:        'value must be less than or equal %{option}',
        min:        'value must be greater than or equal %{option}',
        range:      'value must be within the range %{option}',
        regexp:     'value does not satisfy the condition %{option}'
    },
    optionKeys =
    {
        required:   { required: true, default: { val: false, msg: defaultErrorMsg.required }, msg: defaultErrorMsg.required },
        type:       { required: true, default: { val: 'string', strict: false, msg: defaultErrorMsg.type }, msg: defaultErrorMsg.type },
        instance:   { required: false, default: { val: null, msg: defaultErrorMsg.instance }, msg: defaultErrorMsg.instance },
        choices:    { required: false, msg: defaultErrorMsg.choices },
        min:        { required: false, msg: defaultErrorMsg.min },
        max:        { required: false, msg: defaultErrorMsg.max },
        range:      { required: false, msg: defaultErrorMsg.range },
        regexp:     { required: false, msg: defaultErrorMsg.regexp },
        default:    { required: false, msg: '' }
    },

    baseTypes = ['string', 'number', 'boolean', 'object', 'function'],
    baseClass = ['Date', 'Array', 'Buffer'];


//======================================================================================================================
__options.defaultErrorMsg = defaultErrorMsg;
__options.optionKeys = optionKeys;
__options.baseTypes = baseTypes;
__options.baseClass = baseClass;
__options.key = key;
