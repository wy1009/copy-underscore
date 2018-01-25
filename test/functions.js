;(function () {
    QUnit.test('bind', function (assert) {
        var context = { name: 'moe' }
        var func = function (arg) { return 'name: ' + (this.name || arg) }

        var bound = _.bind(func, context)
        assert.strictEqual(bound(), 'name: moe', '可以将函数绑定在一个上下文中')

        bound = _(func).bind(context)
        assert.strictEqual(bound(), 'name: moe', '支持面向对象绑定')

        bound = _.bind(func, null, 'curly')
        var result = bound()
        assert.ok(result === 'name: curly' || result === 'name: ' + window.name, '可以不传入context')

        func = function (salutation, name) { return salutation + ': ' + name }
        func = _.bind(func, this, 'hello')
        assert.strictEqual(func('moe'), 'hello: moe', '函数被提前传入参数')

        func = _.bind(func, this, 'curly')
        assert.strictEqual(func(), 'hello: curly', '函数完全被提前传入参数')

        func = function (salutation, firstname, lastname) { return salutation + ': ' + firstname + ' ' + lastname }
        func = _.bind(func, this, 'hello', 'moe', 'curly')
        assert.strictEqual(func(), 'hello: moe curly', '可以预先传参且可以传多个参数')

        func = function () { return this }
        assert.strictEqual(typeof _.bind(func, 0)(), 'object', '绑定原始类型作为this，返回包裹的原始类型')

        assert.strictEqual(_.bind(func, 0)().valueOf(), 0, '执行上下文可以是0')
        assert.strictEqual(_.bind(func, '')().valueOf(), '', '执行上下文可以是空字符串')
        assert.strictEqual(_.bind(func, false)().valueOf(), false, '执行上下文可以使false')

        var F = function () { return this }
        var boundf = _.bind(F, { hello: 'moe curly' })
        var Boundf = boundf // make eslint happy.
        var newBoundf = new Boundf()
        assert.strictEqual(newBoundf.hello, void 0, '遵从es5，function不应该被绑定在此执行上下文上')
        assert.strictEqual(boundf().hello, 'moe curly', '当没有用new操作符调用时，可以绑定上下文')
        assert.ok(newBoundf instanceof F, '被绑定的实例是原函数的实例')

        assert.raises(function () { _.bind('notafunction') }, TypeError, '当传入的不是函数时，抛出错误')
    })

    QUnit.test('bindAll', function (assert) {
        var curly = { name: 'curly' }
        var moe = {
            name: 'moe',
            getName: function() { return 'name: ' + this.name },
            sayHi: function() { return 'hi: ' + this.name }
        }
        curly.getName = moe.getName
        _.bindAll(moe, 'getName', 'sayHi')
        curly.sayHi = moe.sayHi
        assert.strictEqual(curly.getName(), 'name: curly', '未绑定函数绑在正确的对象向上')
        assert.strictEqual(curly.sayHi(), 'hi: moe', '绑定函数仍绑定在原对象上')

        curly = {name: 'curly'}
        moe = {
        name: 'moe',
            getName: function() { return 'name: ' + this.name },
            sayHi: function() { return 'hi: ' + this.name },
            sayLast: function() { return this.sayHi(_.last(arguments)) }
        }
        assert.raises(function() { _.bindAll(moe) }, Error, '没有传入函数名，抛出错误')
        assert.raises(function() { _.bindAll(moe, 'sayBye') }, TypeError, '如果没有给定key的函数，抛出错误')
        assert.raises(function() { _.bindAll(moe, 'name') }, TypeError, '当给定的key不是函数时，抛出错误')

        _.bindAll(moe, 'sayHi', 'sayLast')
        curly.sayHi = moe.sayHi
        assert.strictEqual(curly.sayHi(), 'hi: moe')

        var sayLast = moe.sayLast
        assert.strictEqual(sayLast(1, 2, 3, 4, 5, 6, 7, 'Tom'), 'hi: moe')

        _.bindAll(moe, ['getName', 'sayHi'])
        var getName = moe.getName
        assert.strictEqual(getName(), 'name: moe', '将参数展开为一个列表')
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

    QUnit.test('negate', function (assert) {
        var isOdd = function (n) {
            return n & 1
        }
        assert.strictEqual(_.negate(isOdd)(2), true)
        assert.strictEqual(_.negate(isOdd)(1), false)
    })
})()