;(function () {
    QUnit.test('each', function (assert) {
        var list = [1, 2, 3]
        _.each(list, function (num, i) {
            assert.strictEqual(num, i + 1, '每个回调函数提供了value和index')
        })

        var ans = []
        _.each(list, function (num) {
            ans.push(num * this.multiplier)
        }, { multiplier: 5 })
        assert.deepEqual(ans, [5, 10, 15], '执行上下文')

        ans = []
        _.each(list, function (num) {
            ans.push(num)
        })
        assert.deepEqual(ans, list, '可以简单地迭代一个数组')

        ans = []
        var obj = { one: 1, two: 2, three: 3 }
        obj.constructor.prototype.four = 4
        _.each(obj, function (val, key) {
            ans.push(key)
        })
        assert.deepEqual(ans, ['one', 'two', 'three'], '迭代奏效，并无视了原型链上的属性')
        delete obj.constructor.prototype.four

        var count = 0
        obj = { 1: 'foo', 2: 'bar', 3: 'baz' }
        _.each(obj, function () {
            count ++
        })
        assert.strictEqual(count, 3, '这个函数应该被执行三次')

        ans = null
        _.each(list, function (num, i, arr) {
            if (_.include(arr, num)) {
                ans = true
            }
        })
        assert.ok(ans, '可以从迭代器中取得值')

        ans = 0
        _.each(null, function () {
            ++ ans
        })
        assert.strictEqual(ans, 0, '传入null值')

        _.each(false, _.noop)

        assert.strictEqual(_.each(list, _.noop), list, '返回处理后的对象')
        assert.strictEqual(_.each(null, _.noop), null)
    })

    QUnit.test('map', function (assert) {
        var doubled = _.map([1, 2, 3], function (num) {
            return num * 2
        })
        assert.deepEqual(doubled, [2, 4, 6])

        var tripled = _.map([1, 2, 3], function (num) {
            return num * this.multiplier
        }, { multiplier: 3 })
        assert.deepEqual(tripled, [3, 6, 9])

        var ids = _.map({ length: 2, 0: { id: 1 }, 1: { id: 2 } }, function (item) {
            return item.id
        })
        assert.deepEqual(ids, [1, 2], '可以用于array-like对象')

        assert.deepEqual(_.map(null, _.noop), [], '可以处理空的情况')
        assert.deepEqual(_.map([1], function (item) {
            return this.length
        }, [1, 2]), [2], '有执行上下文的情况')

        var people = [{ name: 'moe', age: 30 }, { name: 'curly', age: 50 }]
        // 依赖于cb函数的自动处理。如果传入字符串，则自动将该字符串当做属性名处理，返回一个传入obj return obj的该属性值的函数
        assert.deepEqual(_.map(people, 'name'), ['moe', 'curly'], '传入字符串，则自动取该字符串对应的属性名')
    })

    QUnit.test('reduce', function (assert) {
        var arr = [1, 2, 3]
        assert.strictEqual(_.reduce(arr, function (memo, num) {
            return memo + num
        }, 0), 6, '可以将一个数组加在一起')

        var context = { multiplier: 3 }
        assert.strictEqual(_.reduce(arr, function (memo, num) {
            return memo + num * this.multiplier
        }, 0, context), 18, '执行上下文')

        assert.strictEqual(_.reduce(arr, function (memo, num) {
            return memo + num
        }), 6, '默认初始值')

        assert.strictEqual(_.reduce([1, 2, 3, 4], function (memo, num) {
            return memo * num
        }), 24, '可以乘法归纳')
        
        assert.strictEqual(_.reduce(null, _.noop, 138), 138, '可以接受有初始值的null')
        assert.strictEqual(_.reduce([], _.noop, void 0), void 0, 'undefined可以作为特殊用例通过')
        assert.strictEqual(_.reduce([_], _.noop), _, '集合长度为1，没有初始值，返回第一个值')
        assert.strictEqual(_.reduce([], _.noop), void 0, '集合为空，没有初始值，返回undefined')
    })

    QUnit.test('foldl', function (assert) {
        assert.strictEqual(_.foldl, _.reduce, '是reduce的别名')
    })

    QUnit.test('inject', function (assert) {
        assert.strictEqual(_.inject, _.reduce, '是reduce的别名')
    })

    QUnit.test('reduceRight', function (assert) {
        var list = ['foo', 'bar', 'baz']
        assert.strictEqual(_.reduceRight(list, function (memo, str) {
            return memo + str
        }, ''), 'bazbarfoo', '可以从右折叠')
        assert.strictEqual(_.reduceRight(list, function (memo, str) {
            return memo + str
        }), 'bazbarfoo', '默认初始值')

        assert.strictEqual(_.reduceRight({ a: 1, b: 2, c: 3 }, function (memo, num) {
            return memo + num
        }), 6, '传入对象，默认初始值')

        assert.strictEqual(_.reduce(null, _.noop, 138), 138, '可以接受有初始值的null')
        assert.strictEqual(_.reduce([], _.noop, void 0), void 0, 'undefined可以作为特殊用例通过')
        assert.strictEqual(_.reduce([_], _.noop), _, '集合长度为1，没有初始值，返回第一个值')
        assert.strictEqual(_.reduce([], _.noop), void 0, '集合为空，没有初始值，返回undefined')

        var args,
            init = {},
            obj = { a: 1, b: 2 },
            lastKey = _.keys(obj).pop()
        var expected = lastKey === 'a' ? [init, 1, 'a', obj] : [init, 2, 'b', obj]
        _.reduceRight(obj, function () {
            if (!args) {
                args = _.toArray(arguments)
            }
        }, init)
        assert.deepEqual(args, expected)

        obj = { 2: 'a', 1: 'b' }
        lastKey = _.keys(obj).pop()
        args = null
        expected = lastKey === '2' ? [init, 'a', '2', obj] : [init, 'b', '1', obj]
        _.reduceRight(obj, function () {
            if (!args) {
                args = _.toArray(arguments)
            }
        }, init)
        assert.deepEqual(args, expected)
    })

    QUnit.test('foldr', function (assert) {
        assert.strictEqual(_.foldr, _.reduceRight, '是reduceRight的别名')
    })

    QUnit.test('find', function (assert) {
        var arr = [1, 2, 3, 4]
        assert.strictEqual(_.find(arr, function (n) {
            return n > 2
        }), 3, '应该返回第一个找到的value')
        assert.strictEqual(_.find(arr, function () {
            return false
        }), void 0, '如果没有找到value，应该返回undefined')
        
        arr.dontmatch = 55
        assert.strictEqual(_.find(arr, function (n) {
            return n === 55
        }), void 0, '对array-like有效')

        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 2, b: 4 }]
        assert.deepEqual(_.find(list, { a: 1 }), { a: 1, b: 2 }, '可以被用作findWhere')
        assert.deepEqual(_.find(list, { b: 4 }), { a: 1, b: 4 })
        assert.strictEqual(_.find(list, { c: 1 }), void 0, '在没找到时返回undefined')
        assert.strictEqual(_.find([], { c: 1 }), void 0, '在检索空列表时为undefined')

        assert.strictEqual(_.find([1, 2, 3], function (n) {
            return n * 2 === 4
        }), 2, '找到2并停止循环')

        var obj = {
            a: { x: 1, z: 3 },
            b: { x: 2, z: 2 },
            c: { x: 3, z: 4 },
            d: { x: 4, z: 1 }
        }
        assert.deepEqual(_.find(obj, { x: 2 }), { x: 2, z: 2 }, '对对象生效')
        assert.deepEqual(_.find(obj, { x: 2, z: 1 }), void 0)
        assert.deepEqual(_.find(obj, function (x) {
            return x.x === 4
        }), { x: 4, z: 1 })

        _.find([{ a: 1 }], function (val, key, obj) {
            assert.strictEqual(key, 0)
            assert.deepEqual(val, { a: 1 })
            assert.strictEqual(this, _, '执行上下文')
        }, _)
    })

    QUnit.test('detect', function (assert) {
        assert.strictEqual(_.detect, _.find, '是find的别名')
    })

    QUnit.test('filter', function (assert) {
        var arr = [1, 2, 3, 4, 5, 6],
            obj = { one: 1, two: 2, three: 3 },
            isEven = function (num) {
                return num % 2 === 0
            }
        assert.deepEqual(_.filter(arr, isEven), [2, 4, 6])
        assert.deepEqual(_.filter(obj, isEven), [2], '能够过滤对象')
        assert.deepEqual(_.filter([{}, obj, []], 'two'), [obj], '断言字符串，连接至object的属性')
        _.filter([1], function () {
            assert.strictEqual(this, obj, '执行上下文')
        }, obj)

        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
        assert.deepEqual(_.filter(list, { a: 1 }), [{ a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }])
        assert.deepEqual(_.filter(list, { b: 2 }), [{ a: 1, b: 2 }, { a: 2, b: 2 }])
        assert.deepEqual(_.filter(list, {}), list, '空对象返回所有值')
    })

    QUnit.test('where', function (assert) {
        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }],
            result = _.where(list, { a: 1 })
        assert.strictEqual(result.length, 3)
        assert.strictEqual(result[result.length - 1].b, 4)

        result = _.where(list, { b: 2 })
        assert.strictEqual(result.length, 2)
        assert.strictEqual(result[0].a, 1)

        result = _.where(list, {})
        assert.strictEqual(result.length, list.length)

        function test () {}
        test.map = _.map
        assert.deepEqual(_.where([_, { a: 1, b: 2 }, _], test), [_, _], '函数的属性也会被检查')
    })

    QUnit.test('findWhere', function (assert) {
        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
        assert.deepEqual(_.findWhere(list, { a: 1 }), { a: 1, b: 2 })
        assert.deepEqual(_.findWhere(list, { b: 4 }), { a: 1, b: 4 })
        assert.strictEqual(_.findWhere(list, { c: 1 }), void 0, '查找不到结果时返回undefined')
        assert.strictEqual(_.findWhere([], { a: 1 }), void 0, '列表为空时返回undefined')

        function test () {}
        test.map = _.map
        assert.strictEqual(_.findWhere([_, { a: 1, b: 2 }, _], test), _, '函数的属性也会被检查')

        function TestClass () {
            this.y = 5
            this.x = 'foo'
        }
        var expected = { c: 1, x: 'foo', y: 5 }
        assert.strictEqual(_.findWhere([{ y: 5, b: 6 }, expected], new TestClass()), expected, '使用实例的属性')
    })

    QUnit.test('reject', function (assert) {
        var numbers = [1, 2, 3, 4, 5, 6]
        var odds = _.reject(numbers, function (n) {
            return !(n & 1)
        })
        assert.deepEqual(odds, [1, 3, 5], '拒绝每个偶数')

        var context = 'obj'
        var evens = _.reject(numbers, function (n) {
            assert.strictEqual(context, 'obj')
            return n & 1
        }, context)
        assert.deepEqual(evens, [2, 4, 6], '拒绝每个奇数')

        assert.deepEqual(_.reject([odds, { one: 1, two: 2, three: 3 }], 'two'), [odds], '断言字符类型')

        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
        assert.deepEqual(_.reject(list, { a: 1 }), [{ a: 2, b: 2 }])
        assert.deepEqual(_.reject(list, { b: 2 }), [{ a: 1, b: 3 }, { a: 1, b: 4 }])
        assert.deepEqual(_.reject(list, {}), [], '当给予空对象，返回空列表')
    })

    QUnit.test('every', function (assert) {
        assert.ok(_.every([], _.identify), true, '空集合返回true')
        assert.ok(_.every([true, true, true], _.identify), true, '每项都为true')
        assert.notOk(_.every([true, false, true], _.identify), false, '一项为false')
        assert.ok(_.every([0, 10, 28], function (num) {
            return num % 2 === 0
        }), true, '偶数')
        assert.notOk(_.every([0, 11, 28], function (num) {
            return num % 2 === 0
        }), false, '一个奇数')
        assert.strictEqual(_.every([1], _.identify), true)
        assert.strictEqual(_.every([0], _.identify), false)
        assert.notOk(_.every([void 0, void 0, void 0], _.identify), '对undefined适用')

        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
        assert.notOk(_.every(list, { a: 1, b: 2 }), '可以传入对象')
        assert.ok(_.every(list, 'a'), '可以传入字符串')

        list = [{ a: 1, b: 2 }, { a: 2, b: 2, c: true }]
        assert.ok(_.every(list, { b: 2 }), '可以传入对象')
        assert.notOk(_.every(list, 'c'), 'string被作为对象的属性名')

        assert.ok(_.every({ a: 1, b: 2, c: 3, d: 4 }, _.isNumber), '接受object')
        assert.notOk(_.every({ a: 1, b: 2, c: 3, d: 4 }, _.isObject), '接受object')
        assert.ok(_.every(['a', 'b', 'c', 'd'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
        assert.notOk(_.every(['a', 'b', 'c', 'd', 'e'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
    })

    QUnit.test('all', function (assert) {
        assert.strictEqual(_.all, _.every, '是every的别名')
    })

    QUnit.test('some', function (assert) {
        assert.notOk(_.some([]), '空集合')
        assert.notOk(_.some([false, false, false]), '全部是false')
        assert.ok(_.some([false, false, true]), '一个true')
        assert.ok(_.some([null, 0, 'yes', false]), '一个字符串')
        assert.notOk(_.some([null, 0, '', false]), 'falsy值')
        assert.notOk(_.some([1, 11, 29], function (num) {
            return !(num & 1)
        }), '全部是奇数')
        assert.ok(_.some([1, 10, 29], function (num) {
            return !(num & 1)
        }), '有一个偶数')
        assert.strictEqual(_.some([1], _.identify), true)
        assert.strictEqual(_.some([0], _.identify), false)
        assert.ok([false, false, true])

        var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
        assert.notOk(_.some(list, { a: 5, b: 2 }), 'can be called width obj')
        assert.ok(_.some(list, 'a'), '字符串mapped to对象属性')

        list = [{ a: 1, b: 2 }, { a: 2, b: 2, c: true }]
        assert.ok(_.some(list, { b: 2 }), 'can be called width obj')
        assert.notOk(_.some(list, 'd'), '字符串mapped to对象属性')

        assert.ok(_.some({ a: '1', b: '2', c: '3', d: '4', e: 6 }, _.isNumber), '接受对象')
        assert.notOk(_.some({ a: 1, b: 2, c: 3, d: 4 }, _.isObject))
        assert.ok(_.some(['a', 'b', 'c', 'd'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
        assert.notOk(_.some(['x', 'y', 'z'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
    })

    QUnit.test('any', function (assert) {
        assert.strictEqual(_.any, _.some, '是some的别名')
    })

    QUnit.test('includes', function (assert) {
        _.each([null, void 0, 0, 1, NaN, {}, []], function (val) {
            assert.strictEqual(_.includes(val, 'hasOwnProperty'), false)
        })
        assert.strictEqual(_.includes([1, 2, 3], 2), true, '2在数组中')
        assert.strictEqual(_.includes([1, 3, 9], 2), false, '2不在数组中')
        assert.strictEqual(_.includes([5, 4, 3, 2, 1], 5, true), false, '使用二分法查找，要求数组正序')
        assert.strictEqual(_.includes({ moe: 1, larry: 3, curly: 9 }, 3), true, '如果是object，只检查值')

        var numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3]
        assert.strictEqual(_.includes(numbers, 1, 1), true, 'fromIndex')
        assert.strictEqual(_.includes(numbers, 1, -1), false, 'fromIndex')
        assert.strictEqual(_.includes(numbers, 1, -2), false, 'fromIndex')
        assert.strictEqual(_.includes(numbers, 1, -3), true, 'fromIndex')
        assert.strictEqual(_.includes(numbers, 1, 6), true, 'fromIndex')
        assert.strictEqual(_.includes(numbers, 1, 7), false, 'fromIndex')
    })

    QUnit.test('include', function (assert) {
        assert.strictEqual(_.include, _.includes, '是includes的别名')
    })

    QUnit.test('contains', function (assert) {
        assert.strictEqual(_.contains, _.includes, '是includes的别名')
    })

    QUnit.test('invoke', function (assert) {
        var list = [[5, 1, 7], [3, 2, 1]]
        var result = _.invoke(list, 'sort')
        assert.deepEqual(result[0], [1, 5, 7], '第一个数组被排序了')
        assert.deepEqual(result[1], [1, 2, 3], '第二个数组被排序了')

        _.invoke([{
            method: function () {
                assert.deepEqual(_.toArray(arguments), [1, 2, 3], 'called width arguments')
            }
        }], 'method', 1, 2, 3)

        assert.raises(function () {
            _.invoke([{ a: 1 }], 'a')
        }, TypeError, '不是函数抛出错误')
    })

    QUnit.test('toArray', function (assert) {
        assert.notOk(_.isArray(arguments), 'arguments不是数组')
        assert.ok(_.isArray(_.toArray()), '将arguments转换为数组')

        var a = [1, 2, 3]
        assert.notStrictEqual(_.toArray(a), a, 'a是被克隆的')
        assert.deepEqual(_.toArray(a), [1, 2, 3], '被克隆的数组包含相同的元素')

        var numbers = _.toArray({ one: 1, two: 2, three: 3 })
        assert.deepEqual(numbers, [1, 2, 3], '对象被变成数组')

        var hearts = '\uD83D\uDC95',
            pair = hearts.split(''),
            expected = [pair[0], hearts, '&', hearts, pair[1]]
        assert.deepEqual(_.toArray(expected.join('')), expected, '对特殊字符有用')
        assert.deepEqual(_.toArray(''), [], '空字符串被转换为空数组')

        if (typeof document !== 'undefined') {
            var actual
            try {
                actual = _.toArray(document.childNodes)
            } catch (error) {
                // ignored
            }
            assert.deepEqual(actual, _.map(document.childNodes, _.identify), '对NodeList有用')
        }
    })
})()