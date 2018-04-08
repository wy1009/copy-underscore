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

        _.bindAll(moe, ['getName', 'sayHi']) // 此处数组中只有一项，则无法测出是否正确。因为将一个只有一项的数组作为取对象值的key传入，会自动取数组中的项
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

    QUnit.test('memoize', function (assert) {
        var fib = function (n) {
            return n < 2 ? n : fib(n - 1) + fib(n - 2)
        }
        assert.strictEqual(fib(10), 55, 'a memoized version of fibonacci produces identical results')
        fib = _.memoize(fib)
        assert.strictEqual(fib(10), 55, 'a memoized version of fibonacci produces identical results')
    
        var o = function (str) {
            return str
        }
        var fastO = _.memoize(o)
        assert.strictEqual(o('toString'), 'toString', 'checks hasOwnProperty')
        assert.strictEqual(fastO('toString'), 'toString', 'checks hasOwnProperty')

        var upper = _.memoize(function(s) {
            return s.toUpperCase()
        })
        assert.strictEqual(upper('foo'), 'FOO')
        assert.strictEqual(upper('bar'), 'BAR')
        assert.deepEqual(upper.cache, {foo: 'FOO', bar: 'BAR'})
        upper.cache = {foo: 'BAR', bar: 'FOO'}
        assert.strictEqual(upper('foo'), 'BAR')
        assert.strictEqual(upper('bar'), 'FOO')
    
        var hashed = _.memoize(function (key) {
        //https://github.com/jashkenas/underscore/pull/1679#discussion_r13736209
            assert.ok(/[a-z]+/.test(key), 'hasher doesn\'t change keys')
            return key
        }, function(key) {
            return key.toUpperCase()
        })
        hashed('yep')
        assert.deepEqual(hashed.cache, {YEP: 'yep'}, 'takes a hasher')
    
        // Test that the hash function can be used to swizzle the key.
        var objCacher = _.memoize(function(value, key) {
            return {key: key, value: value}
        }, function(value, key) {
            return key
        })
        var myObj = objCacher('a', 'alpha')
        var myObjAlias = objCacher('b', 'alpha')
        assert.notStrictEqual(myObj, void 0, 'object is created if second argument used as key')
        assert.strictEqual(myObj, myObjAlias, 'object is cached if second argument used as key')
        assert.strictEqual(myObj.value, 'a', 'object is not modified if second argument used as key')
    })

    QUnit.test('delay', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var delayed = false
        _.delay(function () { delayed = true }, 100)
        setTimeout(function () { assert.notOk(delayed) }, 50)
        setTimeout(function () { assert.ok(delayed); done() }, 150)
    })

    QUnit.test('defer', function (assert) {
        assert.expect(1)
        var done = assert.async()
        var deferred = false
        _.defer(function (bool) { deferred = bool }, true)
        _.delay(function () {
            assert.ok(deferred, 'deferred the function')
            done()
        }, 50)
    })

    QUnit.test('throttle', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 32)
        throttledIncr()
        throttledIncr()

        assert.strictEqual(counter, 1, 'incr立即执行且未重复执行')
        _.delay(function () {
            assert.strictEqual(counter, 2, '被节流')
            done()
        }, 64)
    })

    QUnit.test('throttle arguments', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var value = 0
        var update = function (val) {
            value = val
        }
        var throttleUpdate = _.throttle(update, 32)
        throttleUpdate(1)
        throttleUpdate(2)
        _.delay(function () {
            throttleUpdate(3)
        }, 64)

        assert.strictEqual(value, 1, '更新值')
        _.delay(function () {
            assert.strictEqual(value, 3, '更新至最新值')
            done()
        }, 96)
    })

    QUnit.test('throttle once', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            return ++counter
        }
        var throttledIncr = _.throttle(incr, 32)
        var result = throttledIncr()
        _.delay(function () {
            assert.strictEqual(result, 1, '返回值')
            assert.strictEqual(counter, 1, 'incr只被执行一次')
            done()
        }, 64)
    })

    QUnit.test('throttle twice', function (assert) {
        assert.expect(1)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 32)
        throttledIncr()
        throttledIncr()
        _.delay(function () {
            assert.strictEqual(counter, 2, 'incr被调用了两次')
            done()
        }, 64)
    })

    QUnit.test('more throttling', function (assert) {
        assert.expect(3)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 30)
        throttledIncr()
        throttledIncr()

        assert.strictEqual(counter, 1)
        _.delay(function () {
            assert.strictEqual(counter, 2)
            throttledIncr()
            assert.strictEqual(counter, 3)
            done()
        }, 85)
    })

    QUnit.test('throttle repeatedly with results', function (assert) {
        assert.expect(6)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            return ++counter
        }
        var throttledIncr = _.throttle(incr, 100)
        var results = []
        var saveResult = function () {
            results.push(throttledIncr())
        }
        saveResult() // 1
        saveResult() // 节流 1

        _.delay(saveResult, 50) // 节流 1
        // 100, trailing to 2
        _.delay(saveResult, 150) // 节流 2
        _.delay(saveResult, 160) // 节流 2
        // trailing to 3
        _.delay(saveResult, 230) // 节流 3
        _.delay(function () {
            assert.strictEqual(results[0], 1, 'incr被执行了一次')
            assert.strictEqual(results[1], 1, 'incr被节流')
            assert.strictEqual(results[2], 1, 'incr被节流')
            assert.strictEqual(results[3], 2, 'incr被执行了两次')
            assert.strictEqual(results[4], 2, 'incr被节流')
            assert.strictEqual(results[5], 3, 'incr最后一次被执行')
            done()
        }, 300)
    })

    QUnit.test('throttle triggers trailing call when invoked repeatedly', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var limit = 48
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 32)

        var stamp = new Date()
        while (new Date() - stamp < limit) {
            throttledIncr()
        }
        var lastCount = counter
        assert.ok(counter > 1)
        _.delay(function () {
            assert.ok(counter > lastCount)
            done()
        }, 96)
    })

    QUnit.test('throttle does not trigger leading call when leading is set to false', function (assert) {
        // assert.expect(3)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 100, { leading: false })

        throttledIncr() // 0
        _.delay(throttledIncr, 50) // 节流 0
        _.delay(throttledIncr, 60) // 节流 0
        // 100 to 1
        _.delay(throttledIncr, 200) // 1
        assert.strictEqual(counter, 0)

        _.delay(function () {
            assert.strictEqual(counter, 1, '250ms')
        }, 250)

        _.delay(function () {
            assert.strictEqual(counter, 2, '350ms')
            done()
        }, 350)
    })

    QUnit.test('one more throttle with leading: false test', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 100, { leading: false })

        var time = new Date()
        while (new Date() - time < 350) {
            throttledIncr()
        }

        assert.ok(counter <= 3)
        _.delay(function () {
            assert.ok(counter <= 4)
            done()
        }, 200)
    })

    QUnit.test('throttle does not trigger trailing call when trailing is set to false', function (assert) {
        assert.expect(4)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 60, { trailing: false })
        throttledIncr()
        throttledIncr()
        throttledIncr()
        assert.strictEqual(counter, 1)
        _.delay(function () {
            assert.strictEqual(counter, 1)
            throttledIncr()
            throttledIncr()
            assert.strictEqual(counter, 2)
            _.delay(function() {
                assert.strictEqual(counter, 2)
                done()
            }, 96)
        }, 96)
    })

    QUnit.test('throttle continues to function after system time is set backwards', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var incr = function () {
            counter ++
        }
        var throttledIncr = _.throttle(incr, 100)
        var origNowFunc = _.now

        throttledIncr()
        assert.strictEqual(counter, 1)
        _.now = function () {
            return new Date(2013, 0, 1, 1, 1, 1)
        }

        _.delay(function () {
            throttledIncr()
            assert.strictEqual(counter, 2)
            done()
            _.now = origNowFunc
        }, 200)
    })

    QUnit.test('throttle re-entrant', function (assert) {
        assert.expect(2);
        var done = assert.async()
        var sequence = [['b1', 'b2'], ['c1', 'c2']]
        var value = ''
        var append = function (arg) {
            value += this + arg
            var args = sequence.pop()
            if (args) {
                throttledAppend.call(args[0], args[1])
            }
        }
        var throttledAppend = _.throttle(append, 32)
        throttledAppend.call('a1', 'a2')
        assert.strictEqual(value, 'a1a2')
        _.delay(function () {
            assert.strictEqual(value, 'a1a2c1c2b1b2', 'append was throttled successfully')
            done()
        }, 100)
    })

    QUnit.test('throttle cancel', function (assert) {
        var done = assert.async()
        var counter = 0
        var incr = function () { counter++ }
        var throttledIncr = _.throttle(incr, 32)
        throttledIncr()
        throttledIncr.cancel()
        throttledIncr()
        throttledIncr()

        assert.strictEqual(counter, 2, 'incr was called immediately')
        _.delay(function () {
            assert.strictEqual(counter, 3, 'incr was throttled')
            done()
        }, 64)
    })

    QUnit.test('throttle cancel with leading: false', function (assert) {
        var done = assert.async()
        var counter = 0
        var incr = function(){ counter ++ }
        var throttledIncr = _.throttle(incr, 32, {leading: false})
        throttledIncr()
        throttledIncr.cancel()

        assert.strictEqual(counter, 0, 'incr was throttled')
        _.delay(function(){
            assert.strictEqual(counter, 0, 'incr was throttled')
            done()
        }, 64)
    })

    QUnit.test('debounce', function (assert) {
        assert.expect(1)
        var done = assert.async()
        var counter = 0
        var incr = function () { counter ++ }
        var debouncedIncr = _.debounce(incr, 32)
        debouncedIncr()
        debouncedIncr()
        _.delay(debouncedIncr, 16)
        _.delay(function () {
            assert.strictEqual(counter, 1, 'incr was debounced')
            done()
        }, 96)
    })

    QUnit.test('debounce cancel', function (assert) {
        assert.expect(1)
        var done = assert.async()
        var counter = 0
        var incr = function () { counter ++ }
        var debouncedIncr = _.debounce(incr, 32)
        debouncedIncr()
        debouncedIncr.cancel()
        _.delay(function () {
            assert.strictEqual(counter, 0, 'incr was not called')
            done()
        }, 96)
    })

    QUnit.test('debounce asap', function (assert) {
        assert.expect(6)
        var done = assert.async()
        var a, b, c
        var counter = 0
        var incr = function () { return ++ counter }
        var debouncedIncr = _.debounce(incr, 64, true)
        a = debouncedIncr()
        b = debouncedIncr()
        assert.strictEqual(a, 1)
        assert.strictEqual(b, 1)
        assert.strictEqual(counter, 1, 'incr马上被执行')
        _.delay(debouncedIncr, 16)
        _.delay(debouncedIncr, 32)
        _.delay(debouncedIncr, 48)
        _.delay(function () {
            assert.strictEqual(counter, 1, 'incr被防抖')
            c = debouncedIncr()
            assert.strictEqual(c, 2)
            assert.strictEqual(counter, 2, 'incr被再次调用')
            done()
        }, 128)
    })

    QUnit.test('debounce asap cancel', function (assert) {
        assert.expect(4)
        var done = assert.async()
        var a, b
        var counter = 0
        var incr = function(){ return ++ counter }
        var debouncedIncr = _.debounce(incr, 64, true)
        a = debouncedIncr()
        debouncedIncr.cancel()
        b = debouncedIncr()
        assert.strictEqual(a, 1)
        assert.strictEqual(b, 2)
        assert.strictEqual(counter, 2, 'incr立即被执行')
        _.delay(debouncedIncr, 16)
        _.delay(debouncedIncr, 32)
        _.delay(debouncedIncr, 48)
        _.delay(function () {
            assert.strictEqual(counter, 2, 'incr was debounced')
            done()
        }, 128)
    })

    QUnit.test('debounce asap recursively', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var debouncedIncr = _.debounce(function () {
            counter ++
            if (counter < 10) {
                debouncedIncr()
            }
        }, 32, true)
        debouncedIncr()
        assert.strictEqual(counter, 1, 'incr被立即执行')
        _.delay(function () {
            assert.strictEqual(counter, 1, 'incr被防抖')
            done()
        }, 96)
    })

    QUnit.test('debounce after system time is set backwards', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var counter = 0
        var origNowFunc = _.now
        var debouncedIncr = _.debounce(function () {
            counter ++
        }, 100, true)

        debouncedIncr()
        assert.strictEqual(counter, 1, 'incr was called immediately')

        _.now = function () {
            return new Date(2013, 0, 1, 1, 1, 1)
        }

        _.delay(function () {
            debouncedIncr()
            assert.strictEqual(counter, 2, 'incr was debounced successfully')
            done()
            _.now = origNowFunc
        }, 200)
    })

    QUnit.test('debounce re-entrant', function (assert) {
        assert.expect(2)
        var done = assert.async()
        var sequence = [['b1', 'b2']]
        var value = ''
        var debouncedAppend
        var append = function (arg) {
            value += this + arg
            var args = sequence.pop()
            if (args) {
                debouncedAppend.call(args[0], args[1])
            }
        }
        debouncedAppend = _.debounce(append, 32)
        debouncedAppend.call('a1', 'a2')
        assert.strictEqual(value, '')
        _.delay(function () {
            assert.strictEqual(value, 'a1a2b1b2', 'append was debounced successfully')
            done()
        }, 100)
    })

    QUnit.test('once', function (assert) {
        var num = 0
        var increment = _.once(function () { return ++num })
        increment()
        increment()
        assert.strictEqual(num, 1)

        assert.strictEqual(increment(), 1, 'stores a memo to the last value')
    })

    QUnit.test('Recursive onced function', function (assert) {
        assert.expect(1)
        var f = _.once(function () {
            assert.ok(true)
            f()
        })
        f()
    })

    QUnit.test('negate', function (assert) {
        var isOdd = function (n) {
            return n & 1
        }
        assert.strictEqual(_.negate(isOdd)(2), true)
        assert.strictEqual(_.negate(isOdd)(1), false)
    })
})()