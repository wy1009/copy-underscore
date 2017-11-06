(function () {
    QUnit.test('keys', function (assert) {
        assert.deepEqual(_.keys({ one: 1, two: 2 }), ['one', 'two'], '可以从对象中提取出key')
        var arr = []
        arr[1] = 0
        assert.deepEqual(_.keys(arr), ['1'], '不会被稀疏数组所愚弄')
        assert.deepEqual(_.keys(null), [])
        assert.deepEqual(_.keys(void 0), [])
        assert.deepEqual(_.keys(1), [])
        assert.deepEqual(_.keys('a'), [])
        assert.deepEqual(_.keys(true), [])

        var fn = function () {}
        fn.a = 'b'
        assert.deepEqual(_.keys(fn), ['a'])
    })
})()