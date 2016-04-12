"use strict";

(function (root, undefined) {

    function diff(oldTree, newTree) {
        var index = 0;
        var patches = {};
        _dfsWalk(oldTree, newTree, index, patches);
        return patches;
    }

    function _dfsWalk(oldNode, newNode, index, patches) {
        var currentPatch = [];
        if (newNode == null) {
        } else if (Util.isString(oldNode) && Util.isString(newNode)) {
            if (oldNode != newNode) {
                currentPatch.push({
                    "type": patch.TEXT,
                    "content": newNode
                });
            }
        } else if (oldNode.tagName == newNode.tagName && oldNode.key == newNode.key) {
            //  节点类型相同,比较节点属性是否相同
            var propsPatches = _diffProps(oldNode, newNode);
            if (propsPatches) {
                currentPatch.push({
                    "type": patch.PROPS,
                    "props": propsPatches
                });
            }
            //  比较子节点是否相同
            _diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
        }

        if (currentPatch.length) {
            patches[index] = currentPatch;
        }
    }

    function _diffProps(oldNode, newNode) {
        var count = 0;
        var oldProps = oldNode.props;
        var newProps = newNode.props;
        var key, value, propsPatches = {};

        //  找出不同的属性
        for (key in oldProps) {
            value = oldProps[key];
            if (newProps[key] != value) {
                count++;
                propsPatches[key] = newProps[key];
            }
        }

        //  找出新增的属性
        for (key in newProps) {
            value = newProps[key];
            if (!oldProps.hasOwnProperty(key)) {
                count ++;
                propsPatches[key] = newProps[key];
            }
        }

        if(count == 0){
            return null;
        }

        return propsPatches;
    }

    function _diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
        var diffs = lastDiff.diff(oldChildren, newChildren, "key");
        newChildren = diffs.children;
        if (diffs.moves.length) {
            currentPatch.push({
                "type": patch.REORDER,
                "moves": diffs.moves
            });
        }

        var leftNode = null;
        var currentNodeIndex = index;
        Util.each(oldChildren, function (item, index) {
            var newChild = newChildren[index];
            currentNodeIndex = (leftNode && leftNode.count) ? (currentNodeIndex + leftNode.count + 1) : currentNodeIndex + 1;
            _dfsWalk(item, newChild, currentNodeIndex, patches);
            leftNode = item;
        });
    }

    root.diff = diff;

}(window));
