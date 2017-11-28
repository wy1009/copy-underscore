;(function () {
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

        assert.deepEqual(_.map(null, function () {}), [], '可以处理空的情况')
        assert.deepEqual(_.map([1], function (item) {
            return this.length
        }, [1, 2]), [2], '有执行上下文的情况')

        var people = [{ name: 'moe', age: 30 }, { name: 'curly', age: 50 }]
        // 依赖于cb函数的自动处理。如果传入字符串，则自动将该字符串当做属性名处理，返回一个传入obj return obj的该属性值的函数
        assert.deepEqual(_.map(people, 'name'), ['moe', 'curly'], '传入字符串，则自动取该字符串对应的属性名')
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
})()