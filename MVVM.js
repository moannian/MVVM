class MVVM {
    constructor(options) {
        // 第一步,把挂载的东西放在实例上
        this.$el = options.el;

        this.$data = options.data;
        // 第二步开始编译
        if (this.$el) {
            // 模板的编译
            new Compile(this.$el, this);
            // 数据劫持
            new Observer(this.$data)
        }

    }
}