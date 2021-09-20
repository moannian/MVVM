class Compile {
    constructor(el, vm) {
            this.el = this.isElmentNode(el) ? el : document.querySelector(el);
            this.vm = vm;
            // 判断这个元素是否获取的到，如果获取，才开始编译
            if (this.el) {
                // 1、把获得真实的DOM放入内存中 fragment
                let fragment = this.node2fragment(this.el);
                // 2、编译：提取想要的元素节点（v-model）与文本节点（{{}}）
                this.compile(fragment);
                // 把编译文本在放入页面中
                this.el.appendChild(fragment)
            }
        }
        // 辅助方法
        // 判断el是否是个节点
    isElmentNode(node) {
            // 元素类型的节点等于1
            return node.nodeType === 1
        }
        // 判断是否为指令
    isDirective(name) {
            // 看看name中是否包含'v-'
            return name.includes('v-')
        }
        // 看看是否为{{}}

    // 核心方法

    //将节点都放在内存中
    node2fragment(el) {
            // 方法创建了一虚拟的节点对象，节点对象包含所有属性和方法。
            // 它属于内存中的方法
            let fragment = document.createDocumentFragment();
            let fristChild;

            while (fristChild = el.firstChild) {
                fragment.appendChild(fristChild)
            }
            return fragment
        }
        // 编译
    compile(fragment) {
        let children = fragment.childNodes
        Array.from(children).forEach(node => {
            if (this.isElmentNode(node)) {
                // 元素节点
                // 编译元素
                this.compileElement(node);
                // 如果是元素节点，为了防止元素节点里面还有元素节点，此处我们用一下递归
                this.compile(node)
            } else {
                // 文本节点
                // 编译文本
                this.compileText(node);
            }
        })

    };
    // 编译元素节点
    compileElement(node) {
        // 第一步:取节点中的属性
        let property = node.attributes;
        Array.from(property).forEach(attr => {
            // 这样能提取对象的属性
            let attrName = attr.name
                // 判断是否为v-model
            if (this.isDirective(attrName)) {
                // 找到对应的值放在节点上；
                let type = attrName.split('v-')[1]

                let expr = attr.value;

                compileUtil[type](node, this.vm, expr)
            }
        })
    };
    // 编译文本
    compileText(node) {
        //textContent 是获取文本中的信息
        let text = node.textContent;
        //   这里用正则来判断是否为大胡子语法；
        let reg = /\{\{([^\}]+)\}\}/g
        if (reg.test(text)) {
            compileUtil['text'](node, this.vm, text)
        }
    }
}

compileUtil = {
    getVal(vm, value) {
        value = value.split('.');
        return value.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    },
    getTextValue(vm, value) {
        return value.replace(/\{\{([^\}]+)\}\}/g, (...arg) => {
            return this.getVal(vm, arg[1])
        })
    },
    text(node, vm, value) {
        // 文本处理
        let updataFn = this.updata['textUpdata']
        let value1 = this.getTextValue(vm, value);

        // 处理更新的数据
        value.replace(/\{\{([^\}]+)\}\}/g, (...arg) => {

            return new Watcher(vm, arg[1], (newValue) => {

                updataFn(node, this.getTextValue(vm, value))

            })
        })
        updataFn(node, value1)
    },
    setVal(vm, value, newValue) {
        value = value.split('.');
        let Redece = value.reduce((prev, next) => {
            return prev[next] = newValue;
        }, vm.$data)
        return Redece;

    },
    model(node, vm, value) {
        // 输入框处理
        let updataFn = this.updata['modelUpdata']

        // 这里应该加一个监控,数据变化了,应该调用这个Watch的callback
        new Watcher(vm, value, (newValue) => {
            console.log(2222);
            updataFn(node, this.getVal(vm, value))

        })
        node.addEventListener("input", (e) => {
            let newValue = e.target.value;
            this.setVal(vm, value, newValue)
        })
        updataFn(node, this.getVal(vm, value))
    },
    updata: {
        // 文本更新
        textUpdata(node, vaule) {
            node.textContent = vaule
        },
        // 输入框更新
        modelUpdata(node, vaule) {
            node.value = vaule
        }
    }
}