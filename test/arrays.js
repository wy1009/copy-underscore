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

        assert.strictEqual(_.findIndex(objects, function (obj) {
            return obj.a * obj.b === 5
        }), -1)

        // 以该测试用例为例，传入一个字符串，相当于检测数组，每项的'a'属性是否为true，为true则返回index
        assert.strictEqual(_.findIndex(objects, 'a'), 1)
        assert.strictEqual(_.findIndex(null, function () {}), -1)
        
        _.findIndex([{ a: 1 }], function (obj, index, objs) {
            assert.strictEqual(index, 0)
            assert.deepEqual(objs, [{ a: 1 }])
            assert.strictEqual(this, objects, '执行上下文')
        }, objects)

        var sparses = []
        sparses[20] = { a: 2, b: 2 }
        assert.strictEqual(_.findIndex(sparses, function (obj) {
            return obj && obj.a * obj.b === 4
        }), 20, '对稀疏数组可行')

        var arr = [1, 2, 3, 4]
        arr.match = 55
        assert.strictEqual(_.findIndex(arr, function (obj) {
            return obj === 55
        }), -1)
    })
})()