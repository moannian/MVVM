class Observer {
    constructor(data) {
        this.observer(data)
    }
    observer(data) {
            // 将data数据将原有的属性改成set与get的形式；
            if (!data || typeof data !== 'object') {
                return
            }
            // 先获取到data中的key和value
            Object.keys(data).forEach(key => {
                // 劫持
                this.defineReactive(data, key, data[key])
                this.observer(data[key])
            })
        }
        // 定义数据劫持
    defineReactive(obj, key, value) {

        let that = this;
        let dep = new Dep()
        return Object.defineProperty(obj, key, {

            enumerable: true,
            get() {

                Dep.target && dep.addSub(Dep.target)
                return value;
            },
            set(newValue) {

                if (newValue !== value) {
                    that.observer(newValue) //如果是对象则继续劫持
                    value = newValue;
                    console.log(newValue);
                    dep.notify();


                }
            }
        })

    }
}

class Dep {

    constructor() {
        // 订阅的数组
        this.subs = [];

    }
    addSub(Watcher) {
        this.subs.push(Watcher)

    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}