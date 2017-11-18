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
})()