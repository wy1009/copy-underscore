(function () {
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
        assert.deepEqual(ids, [1, 2], '可以用于类数组对象')

        assert.deepEqual(_.map(null, function () {}), [], '可以处理空的情况')
        assert.deepEqual(_.map([1], function (item) {
            return this.length
        }, [1, 2]), [2], '有执行上下文的情况')

        var people = [{ name: 'moe', age: 30 }, { name: 'curly', age: 50 }]
        // 依赖于cb函数的自动处理。如果传入字符串，则自动将该字符串当做属性名处理，返回一个传入obj return obj的该属性值的函数
        assert.deepEqual(_.map(people, 'name'), ['moe', 'curly'], '传入字符串，则自动取该字符串对应的属性名')
    })
})()