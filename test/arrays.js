(function () {
    QUnit.test('findIndex', function (assert) {
        var objects = [
            { a: 0, b: 0 },
            { a: 1, b: 1 },
            { a: 2, b: 2 },
            { a: 0, b: 0 }
        ]
    
        assert.strictEqual(_.findIndex(objects, function (obj) {
            return obj.a === 0
        }), 0, '只返回从开始算起第一个符合条件的index')
    
        assert.strictEqual(_.findIndex(objects, function (obj) {
            return obj.a * obj.b === 4
        }), 2)
    
        // 以该测试用例为例，传入一个字符串，相当于检测数组，每项的'a'属性是否为true，为true则返回index
        assert.strictEqual(_.findIndex(objects, 'a'), 1)
    })
})()