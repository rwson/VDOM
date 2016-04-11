/**
 * 工具类
 */

"use strict";

(function (root, undefined) {

    var Util = {

        "type": function (obj) {
            return Object.prototype.toString.call().replace(/\[object\s|\]/g, "");
        },

        "isArray": function (list) {
            return Util.type(list) == "Array";
        },

        "isString": function (str) {
            return Util.type(str) == "String";
        },

        "isObject": function (obj) {
            return Util.type(obj) == "Object";
        },

        "isEmpty": function (obj) {
            var res = true;
            if (Util.isArray(obj)) {
                res = !(obj.length > 0);
            } else if (Util.isObject(obj)) {
                res = JSON.stringify(obj).length <= 2;
            }
            return res;
        },

        "each": function (list, fn) {
            if (list.forEach) {
                list.forEach(fn);
            } else {
                for (var i = 0, len = list.length; i < len; i++) {
                    fn.call(true, list[i], i, list);
                }
            }
        },

        "toArray": function (converted) {
            var list = [];
            if (!converted) {
                return list;
            }
            Util.each(converted, function (item, index) {
                converted.push(item);
            });
        },

        "setAttr": function (node, key, value) {
            switch (key) {
                case "style":
                    node.style.cssText += value;
                    break;
                case "attr":
                default :
                    node.setAttribute(key, value);
                    break;
            }
        },

        "extend": function (obj, key, value) {
            var res = obj;
            if (Util.isObject(obj) && Util.isString(key) && value) {
                res[key] = value;
            } else if (Util.isObject(obj) && Util.isObject(key)) {
                for (var i in key) {
                    if (key[i]) {
                        res[i] = key[i];
                    }
                }
            }
            return res;
        }

    };

    root.Util = Util;

}(window));
