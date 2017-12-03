;(function () {
    QUnit.test('negate', function (assert) {
        var isOdd = function (n) {
            return n & 1
        }
        assert.strictEqual(_.negate(isOdd)(2), true)
        assert.strictEqual(_.negate(isOdd)(1), false)
    })

    QUnit.test('partial', function (assert) {
        var obj = { name: 'moe' },
            func = function () { return this.name + ' ' + _.toArray(arguments).join(' ') }
        
        obj.func = _.partial(func, 'a', 'b')
        assert.strictEqual(obj.func('c', 'd'), 'moe a b c d', '可以加入预先的参数')

        obj.func = _.partial(func, _, 'b', _, 'd')
        assert.strictEqual(obj.func('a', 'c'), 'moe a b c d', '可以使用placeholder')

        func = _.partial(function () {
            return arguments.length
        }, _, 'b', _, 'd')
        assert.strictEqual(func('a', 'c', 'e'), 5, '可以接受比placeholder更多的参数')
        assert.strictEqual(func('a'), 4, '可以接受比placeholder更少的参数')

        func = _.partial(function () {
            return typeof arguments[2]
        }, _, 'b', _, 'd')
        assert.strictEqual(func('a'), 'undefined', '未填充的placeholder是undefined')

        function MyWidget (name, options) {
            this.name = name
            this.options = options
        }
        MyWidget.prototype.get = function () {
            return this.name
        }
        var MyWidgetWidthCoolOpts = _.partial(MyWidget, _, { a: 1 })
        var widget = new MyWidgetWidthCoolOpts('foo')
        assert.ok(widget instanceof MyWidget, '可以给构造函数绑定一个参数')
        assert.strictEqual(widget.get(), 'foo', '保留了原型')
        assert.deepEqual(widget.options, { a: 1 })

        _.partial.placeholder = obj
        func = _.partial(function () {
            return arguments.length
        }, obj, 'b', obj, 'd')
        assert.strictEqual(func('a'), 4, '允许placeholder被改变')

        _.partial.placeholder = {}
        func = _.partial(function () {
            return arguments.length
        }, obj, 'b', obj, 'd')
        assert.strictEqual(func('a'), 5)

        _.partial.placeholder = _
    })
})()