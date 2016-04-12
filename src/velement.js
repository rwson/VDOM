//"use strict";

(function (root, undefined) {

    function VElement(tagName, props, children) {

        //  确保只能通过new关键字来调用
        if (!(this instanceof VElement)) {
            return new VElement(tagName, props, children);
        }

        //  如果只传入了两个参数的检测
        if (Util.isArray(props)) {
            children = props;
            props = {};
        }

        this.tagName = tagName;
        this.props = props;
        this.children = children;

        var _count = 0;
        var self = this;

        if (this.children && this.children.length) {
            Util.each(this.children, function (item, index) {
                if (item instanceof VElement) {
                    _count += item.count;
                } else {
                    self.children[index] = "" + item;
                }
                _count++;
            });
        }
        this.count = _count;

    }

    VElement.prototype = {

        "constructor": VElement,

        /**
         * 根据虚拟DOM创建真实的DOM并返回
         * @returns {Element}
         */
        "render": function () {

            var el = document.createElement(this.tagName);

            //  赋值属性
            for (var i in this.props) {
                if (this.props[i] && i) {
                    Util.setAttr(el, i, this.props[i]);
                }
            }

            //  子元素
            Util.each(this.children, function (item, index) {
                //  如果子元素为VElement,递归创建子元素,否则直接创建文本节点
                var childEl = (item instanceof VElement) ? item.render() : document.createTextNode(item);
                el.appendChild(childEl);
            });

            return el;
        }

    };

    root.VElement = VElement;

}(window));

