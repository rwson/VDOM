/**
 * 对比并记录两个虚拟DOM之间差异的数据结构
 */

"use strict";

(function (root, undefined) {

    var REPLACE = 0;
    var REORDER = 1;
    var PROPS = 2;
    var TEXT = 3;

    function patch(node, patchs) {
        var walker = {
            "index": 0
        };
        _dfsWalk(node, walker, patchs);
    }

    patch.REPLACE = REPLACE;
    patch.REORDER = REORDER;
    patch.PROPS = PROPS;
    patch.TEXT = TEXT;

    //  深度优先遍历dom结构
    function _dfsWalk(node, walker, patches) {
        var currentPatch = patches[walker.index];
        var len = node.childNodes ? node.childNodes.length : 0;
        for (var i = 0; i < len; i++) {
            var child = node.childNodes[i];
            walker.index++;
            _dfsWalk(child, walker, patches);
        }
        if (currentPatch) {
            _applyPatches(node, currentPatch);
        }
    }

    function _applyPatches(node, currentPatch) {
        Util.each(currentPatch, function (patch) {
            switch (patch.type) {
                case REPLACE:
                    var newNode = Util.isString(patch.node) ? document.createTextNode(patch.node) : patch.node.render();
                    node.parentNode.replaceChild(newNode, node);
                    break;
                case RERENDER:
                    _renderChildren(node, patch.node);
                    break;
                case PROPS:
                    _setProps(node, patch.props);
                    break;
                case TEXT:
                    if (node.textContent) {
                        node.textContent = patch.content;
                    } else {
                        node.nodeValue = patch.content;
                    }
                    break;
                default :
                    throw ("the patch type" + patch.type + "is unknown");
            }
        });
    }

    function _renderChildren(node, patchNode) {
        var staticNodeList = Util.toArray(node.childNodes);
        var maps = {};
        Util.each(staticNodeList, function (item) {
            if (node.nodeType == 1) {
                var key = node.getAttribute("key");
                if (key) {
                    maps[key] = node;
                }
            }
        });

        Util.each(patchNode, function (item) {
            var index = item.index;
            if (item.type == 0) {
                if (staticNodeList[index] == node.childNodes[index]) {
                    node.removeChild(node.childNodes[index]);
                }
                staticNodeList.splice(index,1);
            } else {
                var insertNode = maps[item.item.key]
                    ?
                    maps[item.item.key] : Util.isObject(item.item)
                    ?
                    item.item.render() : document.createTextNode(item.item);
                staticNodeList.splice(index,0,insertNode);
                node.insertBefore(insertNode,node.childNodes[index] || null);
            }
        });
    }

    function _setProps(node, props) {
        for (var i in props) {
            if (!props[i]) {
                node.removeAttribute(i);
            } else {
                node.setAttribute(i, props);
            }
        }
    }

    root.patch = patch;

}(window));
