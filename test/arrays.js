;(function () {
    QUnit.test('findIndex', function (assert) {
        var objects = [
            { a: 0, b: 0 },
            { a: 1, b: 1 },
            { a: 2, b: 2 },
            { a: 0, b: 0 },
            { aa: 1, bb: 1 }
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

        // 以该测试用例为例，传入一个字符串，相当于检测数组每项的'a'属性是否为true，为true则返回index
        assert.strictEqual(_.findIndex(objects, 'aa'), 4)
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

        assert.strictEqual(_.findIndex(document.childNodes, function (node) {
            return typeof node === 'object'
        }), 0, '对array-like生效')
    })

    QUnit.test('findLastIndex', function (assert) {
        var objects = [
            { a: 0, b: 0 },
            { a: 1, b: 1 },
            { a: 2, b: 2 },
            { a: 0, b: 0 },
            { aa: 1, bb: 1 }
        ]
    
        assert.strictEqual(_.findLastIndex(objects, function (obj) {
            return obj.a === 0
        }), 3, '只返回从开始算起最后一个符合条件的index')
    
        assert.strictEqual(_.findLastIndex(objects, function (obj) {
            return obj.a * obj.b === 4
        }), 2)

        assert.strictEqual(_.findLastIndex(objects, function (obj) {
            return obj.a * obj.b === 5
        }), -1)

        // 以该测试用例为例，传入一个字符串，相当于检测数组每项的'a'属性是否为true，为true则返回index
        assert.strictEqual(_.findLastIndex(objects, 'aa'), 4)
        assert.strictEqual(_.findLastIndex(null, function () {}), -1)
        
        _.findLastIndex([{ a: 1 }], function (obj, index, objs) {
            assert.strictEqual(index, 0)
            assert.deepEqual(objs, [{ a: 1 }])
            assert.strictEqual(this, objects, '执行上下文')
        }, objects)

        var sparses = []
        sparses[20] = { a: 2, b: 2 }
        assert.strictEqual(_.findLastIndex(sparses, function (obj) {
            return obj && obj.a * obj.b === 4
        }), 20, '对稀疏数组可行')

        var arr = [1, 2, 3, 4]
        arr.match = 55
        assert.strictEqual(_.findLastIndex(arr, function (obj) {
            return obj === 55
        }), -1)

        assert.strictEqual(_.findLastIndex(document.childNodes, function (node) {
            return typeof node === 'object'
        }), 1, '对array-like生效')
    })

    QUnit.test('sortedIndex', function (assert) {
        var numbers = [10, 20, 30, 40, 50]
        assert.strictEqual(_.sortedIndex(numbers, 35), 3)
        assert.strictEqual(_.sortedIndex(numbers, 30), 2)

        var objects = [{ x: 10 }, { x: 20 }, { x: 30 }, { x: 40 }]
        assert.strictEqual(_.sortedIndex(objects, { x: 25 }, function (item) {
            return item.x
        }), 2)
        assert.strictEqual(_.sortedIndex(objects, { x: 35 }, 'x'), 3)

        var context = { 1: 2, 2: 3, 3: 4 }
        assert.strictEqual(_.sortedIndex([1, 3], 2, function (obj) {
            return this[obj]
        }, context), 1)

        var values = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 131071, 262143, 524287,
            1048575, 2097151, 4194303, 8388607, 16777215, 33554431, 67108863, 134217727, 268435455, 536870911, 1073741823, 2147483647],
            largeArray = Array(Math.pow(2, 32) - 1),
            length = values.length
        while (length --) {
            largeArray[values[length]] = values[length]
        }
        assert.strictEqual(_.sortedIndex(largeArray, 2147483648), 2147483648)
    })

    QUnit.test('indexOf', function (assert) {
        var numbers = [1, 2, 3]
        assert.strictEqual(_.indexOf(numbers, 2), 1, '可以计算indexOf')

        var result = (function () {
            return _.indexOf(arguments, 2)
        })(1, 2, 3)
        assert.strictEqual(result, 1, '对arguments可行')

        _.each([null, void 0, [], false], function (val) {
            var msg = 'Handles: ' + (_.isArray(val) ? '[]' : val)
            assert.strictEqual(_.indexOf(val, 2), -1, msg)
            assert.strictEqual(_.indexOf(val, 2, -1), -1, msg)
            assert.strictEqual(_.indexOf(val, 2, -20), -1, msg)
            assert.strictEqual(_.indexOf(val, 2, 15), -1, msg)
        })

        numbers = [10, 20, 30, 40, 50]
        assert.strictEqual(_.indexOf(numbers, 35, true), -1, '35不在列表中')
        assert.strictEqual(_.indexOf(numbers, 40, true), 3, '40在列表中')

        assert.strictEqual(_.indexOf([1, 2, 5, 4, 6, 7], 5, true), -1, '非有序数组传入true会导致查找错误');

        numbers = [1, 2, 3, 1, 2, 3]
        assert.strictEqual(_.indexOf(numbers, 2, 3), 4, '支持fromIndex参数')
        assert.strictEqual(_.indexOf(numbers, 1, -3), 3, '支持从右边开始的fromIndex参数')
        assert.strictEqual(_.indexOf(numbers, 1, -2), -1, '支持从右边开始的fromIndex参数')
        assert.strictEqual(_.indexOf(numbers, 2, -3), 4)
        _.each([-6, -8, -Infinity], function (fromIndex) {
            assert.strictEqual(_.indexOf(numbers, 1, fromIndex), 0, fromIndex)
        })

        assert.strictEqual(_.indexOf([,,, 0], void 0), 0, '对待稀疏数组像稠密数组一样')
        assert.strictEqual(_.indexOf([], void 0, true), -1, '空数组传入isSorted参数，返回-1')
        
    })
})()