;(function () {
    QUnit.test('constant', function (assert) {
        var stooge = { name: 'moe' }
        assert.strictEqual(_.constant(stooge)(), stooge, '应当创建一个返回stooge的函数')
    })
})()