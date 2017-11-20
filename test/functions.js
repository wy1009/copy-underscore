;(function () {
    QUnit.test('partial', function (asserts) {
        var obj = { name: 'moe' },
            func = function () { return this.name + ' ' + _.toArray(arguments).join(' ') }
        
        obj.func = _.partial(func, 'a', 'b')
        asserts.strictEqual(obj.func('c', 'd'), 'moe a b c d', '可以加入预先的参数')

        obj.func = _.partial(func, _, 'b', _, 'd')
        asserts.strictEqual(obj.func('a', 'c'), 'moe a b c d', '可以使用placeholder')

        func = _.partial(function () {
            return arguments.length
        }, _, 'b', _, 'd')
        asserts.strictEqual(func('a', 'c', 'e'), 5, '可以接受比placeholder更多的参数')
        asserts.strictEqual(func('a'), 4, '可以接受比placeholder更少的参数')

        func = _.partial(function () {
            return typeof arguments[2]
        }, _, 'b', _, 'd')
        asserts.strictEqual(func('a'), 'undefined', '未填充的placeholder是undefined')

        function MyWidget (name, options) {
            this.name = name
            this.options = options
        }
        MyWidget.prototype.get = function () {
            return this.name
        }
        var MyWidgetWidthCoolOpts = _.partial(MyWidget, _, { a: 1 })
        var widget = new MyWidgetWidthCoolOpts('foo')
        asserts.ok(widget instanceof MyWidget, '可以给构造函数绑定一个参数')
        asserts.strictEqual(widget.get(), 'foo', '保留了原型')
        asserts.deepEqual(widget.options, { a: 1 })

        _.partial.placeholder = obj
        func = _.partial(function () {
            return arguments.length
        }, obj, 'b', obj, 'd')
        asserts.strictEqual(func('a'), 4, '允许placeholder被改变')

        _.partial.placeholder = {}
        func = _.partial(function () {
            return arguments.length
        }, obj, 'b', obj, 'd')
        asserts.strictEqual(func('a'), 5)

        _.partial.placeholder = _
    })
})()