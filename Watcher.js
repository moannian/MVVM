// 观察者模式的目的就是给需要变化的那个元素增加一个观察者，当数据变化的时候执行对应的方法
class Watcher {
    constructor(vm, value, cb) {
        this.vm = vm;
        this.value = value;
        this.cb = cb;
        // 先获取一下老值
        this.oldVal = this.get()
    }
    getVal(vm, value) {
        value = value.split('.');
        return value.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    };
    get() {
        Dep.target = this;
        let expr = this.getVal(this.vm, this.value);


        return expr
    };
    // 对外暴露的方法
    update() {
        let newValue = this.getVal(this.vm, this.value);
        let oldValue = this.oldVal;
        if (newValue != oldValue) {
            this.cb(newValue) //调用Watch的callback
        }
    }
}