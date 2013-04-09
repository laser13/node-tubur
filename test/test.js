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

//var www1 = {
//    "device" : {
//        "geo" : {
//            "city" : "RU MSK",
//            "region" : "RU-MOS",
//            "country" : "RU"
//        },
//        "userdata" : "",
//        "ip" : "178.158.100.237",
//        "ua" : "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1106.241 YaBrowser/1.5.1106.241 Safari/537.4"
//    },
//    "site" : {
//        "rereferer" : "http://www.yandex.ru/",
//        "referer" : "http://tv.yandex.ru/213/",
//        "id" : "54061"
//    },
//    "imp" : [
//        { "banner" : { "h" : 250, "w" : 300 }, "id" : "1"}
//    ],
//    "id" : "5592213553214834590"
//};
//
//var www2 = {
//    "device" : {
//        "geo" : {
//            "city" : "RU MSK",
//            "region" : "RU-MOS",
//            "country" : "RU"
//        },
//        "userdata" : "",
//        "ip" : "95.165.165.39",
//        "ua" : "Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3"
//    },
//    "site" : {
//        "rereferer" : "http://www.yandex.ru/",
//        "referer" : "http://tv.yandex.ru/213/",
//        "id" : "54061"
//    },
//    "imp" : [
//        { "banner" : { "h" : 250, "w" : 300 }, "id" : "1" }
//    ],
//    "id" : "5592213550923515803"
//};