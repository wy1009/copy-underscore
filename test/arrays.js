;(function () {
    QUnit.test('first', function (assert) {
        assert.strictEqual(_.first([1, 2, 3]), 1, '可以提出数组的第一个元素')
        assert.strictEqual(_([1, 2, 3]).first(), 1, '面向对象模式')
        assert.deepEqual(_.first([1, 2, 3], 0), [], '等于0时返回空数组')
        assert.deepEqual(_.first([1, 2, 3], -1), [], '小于0时返回空数组')
        assert.deepEqual(_.first([1, 2, 3], 2), [1, 2], '可以取得前n个元素')
        assert.deepEqual(_.first([1, 2, 3], 5), [1, 2, 3], '当n>length时取得整个数组')
        assert.strictEqual(function (){ return _.first(arguments) }(4, 3, 2, 1), 4, '对arguments奏效')
        assert.deepEqual(_.map([[1, 2, 3], [1, 2, 3]], _.first), [1, 1], '和_.map一起用')
        assert.strictEqual(_.first(null), void 0, '当传入null时返回undefined')
    
        Array.prototype[0] = 'boo'
        assert.strictEqual(_.first([]), void 0, '当传入空数组时返回undefined')
        delete Array.prototype[0]
    })

    QUnit.test('head', function (assert) {
        assert.strictEqual(_.head, _.first, '是first的别名')
    })

    QUnit.test('take', function (assert) {
        assert.strictEqual(_.take, _.first, '是first的别名')
    })

    QUnit.test('initial', function (assert) {
        assert.deepEqual(_.initial([1, 2, 3, 4, 5]), [1, 2, 3, 4], '返回除最后一个元素的所有元素')
        assert.deepEqual(_.initial([1, 2, 3, 4], 2), [1, 2], '返回除了后n个元素的所有元素')
        assert.deepEqual(_.initial([1, 2, 3, 4], 6), [], '当n>length时返回空数组')
        assert.deepEqual(function () { return _(arguments).initial() }(1, 2, 3, 4), [1, 2, 3], '对arguments奏效')
        assert.deepEqual(_.flatten(_.map([[1, 2, 3], [1, 2, 3]], _.initial)), [1, 2, 1, 2], '可以与_.map搭配')
        assert.strictEqual(_.initial(null), void 0, '当传入null时返回undefined')
    })

    QUnit.test('last', function (assert) {
        assert.strictEqual(_.last([1, 2, 3]), 3, '能够取出数组最后一个元素')
        assert.strictEqual(_([1, 2, 3]).last(), 3, '支持面向对象模式')
        assert.deepEqual(_.last([1, 2, 3], 0), [], '当n<=0时返回空数组')
        assert.deepEqual(_.last([1, 2, 3], -1), [], '当n<=0时返回空数组')
        assert.deepEqual(_.last([1, 2, 3], 2), [2, 3], '可以取得后n个元素')
        assert.deepEqual(_.last([1, 2, 3], 5), [1, 2, 3], '当n大于length时可以处理')
        assert.strictEqual(function () { return _(arguments).last() }(1, 2, 3, 4), 4, '对arguments奏效')
        assert.deepEqual(_.map([[1, 2, 3], [1, 2, 3]], _.last), [3, 3], '可以与map一起使用')
        assert.strictEqual(_.last(null), void 0, '当传入null时返回undefined')
    
        var arr = []
        arr[-1] = 'boo'
        assert.strictEqual(_.last(arr), void 0, '当空数组时返回undefined')
    })

    QUnit.test('rest', function (assert) {
        var numbers = [1, 2, 3, 4]
        assert.deepEqual(_.rest(numbers), [2, 3, 4], '取出除了第一个元素以外的元素')
        assert.deepEqual(_.rest(numbers, 0), [1, 2, 3, 4], '当index为0时返回所有元素')
        assert.deepEqual(_.rest(numbers, 2), [3, 4])
        assert.deepEqual(function(){ return _(arguments).rest() }(1, 2, 3, 4), [2, 3, 4], '对arguments奏效')
        assert.deepEqual(_.flatten(_.map([[1, 2, 3], [1, 2, 3]], _.rest)), [2, 3, 2, 3], '可以和map配合使用')
        assert.strictEqual(_.rest(null), void 0, '当传入null时返回undefined')
    })

    QUnit.test('compact', function (assert) {
        assert.deepEqual(_.compact([1, false, null, 0, '', void 0, NaN, 2]), [1, 2], '移除falsy值')
        assert.deepEqual(function () { return _.compact(arguments) }(0, 1, false, 2, false, 3), [1, 2, 3], '对arguments奏效')
        assert.deepEqual(_.map([[1, false, false], [false, false, 3]], _.compact), [[1], [3]], '可以和map一起使用')
    })

    QUnit.test('flatten', function (assert) {
        assert.deepEqual(_.flatten(null), [], '支持null')
        assert.deepEqual(_.flatten(void 0), [], '支持undefined')
        assert.deepEqual(_.flatten([[], [[]], []]), [], '支持空数组')
        assert.deepEqual(_.flatten([[], [[]], []], true), [[]], '可以浅flatten空数组')

        var list = [1, [2], [3, [[[4]]]]]
        assert.deepEqual(_.flatten(list), [1, 2, 3, 4], '可以flatten嵌套数组')
        assert.deepEqual(_.flatten(list, true), [1, 2, 3, [[[4]]]], '可以浅flatten嵌套数组')

        assert.deepEqual(function () { return _.flatten(arguments) }(1, [2], [3, [[[4]]]]), [1, 2, 3, 4], '对arguments奏效')

        list = [[[5], 1], [[4]], [2], [3]]
        assert.deepEqual(_.flatten(list, true), [[5], 1, [4], 2, 3])
        assert.deepEqual(_.flatten(list), [5, 1, 4, 2, 3])

        assert.strictEqual(_.flatten([_.range(10), _.range(10), 5, 1, 3], true).length, 23, '能够flatten中等长度的数组')
        assert.strictEqual(_.flatten([_.range(10), _.range(10), 5, 1, 3]).length, 23, '能够浅flatten中等长度的数组')
        assert.strictEqual(_.flatten([new Array(1000000), _.range(56000), 5, 1, 3]).length, 1056003, '能支持巨大的数组')
        assert.strictEqual(_.flatten([new Array(1000000), _.range(56000), 5, 1, 3], true).length, 1056003, '能浅flatten巨大的数组')

        var x = _.range(100000)
        for (var i = 0; i < 1000; i++) x = [x]
        assert.deepEqual(_.flatten(x), _.range(100000), '能够支持很深的数组')
        assert.deepEqual(_.flatten(x, true), x[0], '支持浅flatten很深的数组')
    })

    QUnit.test('without', function (assert) {
        var list = [1, 2, 1, 0, 3, 1, 4]
        assert.deepEqual(_.without(list, 0, 1), [2, 3, 4], '移除给定值')
        assert.deepEqual(function () { return _.without(arguments, 0, 1) }(1, 2, 1, 0, 3, 1, 4), [2, 3, 4], '对arguments奏效')
    
        list = [{ one: 1 }, { two: 2 }]
        assert.deepEqual(_.without(list, { one: 1 }), list, '依照引用比较对象（值用例）')
        assert.deepEqual(_.without(list, list[0]), [{ two: 2 }], '依照引用比较对象（引用用例）')
    })

    QUnit.test('uniq', function (assert) {
        assert.deepEqual(_.uniq([1, 2, 1, 3, 1, 4]), [1, 2, 3, 4], '未排序数组能去重')
        assert.deepEqual(_.uniq([1, 1, 1, 2, 2, 3]), [1, 2, 3], '能为排序过的数组去重')
        
        var list = [{ name: 'Moe' }, { name: 'Curly' }, { name: 'Larry' }, { name: 'Curly' }]
        var expected = [{ name: 'Moe' }, { name: 'Curly' }, { name: 'Larry' }]
        var iterator = function (stooge) { return stooge.name }
        assert.deepEqual(_.uniq(list, false, iterator), expected, '使用iterator的结果去重（未排序例子）')
        assert.deepEqual(_.uniq(list, iterator), expected, '未指定时，isSorted参数默认为false')
        assert.deepEqual(_.uniq(list, 'name'), expected, '当iterator是一个字符串，作为key来去重')

        list = [{ score: 8 }, { score: 10 }, { score: 10 }]
        expected = [{ score: 8 }, { score: 10 }]
        iterator = function (item) { return item.score }
        assert.deepEqual(_.uniq(list, true, iterator), expected, '使用iterator的结果去重（排序例子）')
        assert.deepEqual(_.uniq(list, true, 'score'), expected, '当iterator是一个字符串，作为key来去重（排序例子）')

        assert.deepEqual(_.uniq([{ 0: 1 }, { 0: 1 }, { 0: 1 }, { 0: 2 }], 0), [{ 0: 1 }, { 0: 2 }], '想iterator一样使用falsy值')

        var result = (function () { return _.uniq(arguments) })(1, 2, 1, 3, 1, 4)
        assert.deepEqual(result, [1, 2, 3, 4], '对arguments奏效')

        var a = {}, b = {}, c = {}
        assert.deepEqual(_.uniq([a, b, a, b, c]), [a, b, c], '对等价但是没有序的值有效')

        assert.deepEqual(_.uniq(null), [], '当array不可迭代时，返回空数组')

        var context = {}
        list = [3]
        _.uniq(list, function (val, index, array) {
            assert.strictEqual(this, context, '执行上下文')
            assert.strictEqual(val, 3, '将值传递给迭代器')
            assert.strictEqual(index, 0, '将index传递给迭代器')
            assert.strictEqual(array, list, '将整个数组传递给迭代器')
        }, context)
    })

    QUnit.test('unique', function (assert) {
        assert.strictEqual(_.unique, _.uniq, '是uniq的别名')
    })

    QUnit.test('union', function (assert) {
        assert.deepEqual(_.union([1, 2, 3], [2, 30, 1], [1, 40]), [1, 2, 3, 30, 40], '可以找出一列数组的并集')
        assert.deepEqual(_([1, 2, 3]).union([2, 30, 1], [1, 40]), [1, 2, 3, 30, 40], '面向对象模式')
        assert.deepEqual(_.union([1, 2, 3], [2, 30, 1], [1, 40, [1]]), [1, 2, 3, 30, 40, [1]], '可以找到含嵌套数组的并集')
        assert.deepEqual(_.union([10, 20], [1, 30, 10], [0, 40]), [10, 20, 1, 30, 0, 40], '按初次出现的顺序排序')
        
        var result = (function () { return _.union(arguments, [2, 30, 1], [1, 40]) })(1, 2, 3)
        assert.deepEqual(result, [1, 2, 3, 30, 40], '对arguments奏效')

        assert.deepEqual(_.union([1, 2, 3], 4), [1, 2, 3], '只能够得到数组的并集')
    })

    QUnit.test('intersection', function (assert) {
        var stooge = ['moe', 'curly', 'larry'],
            leaders = ['moe', 'groucho']
        assert.deepEqual(_.intersection(stooge, leaders), ['moe'], '可以找到两个数组的交集')
        assert.deepEqual(_(stooge).intersection(leaders), ['moe'], '面向对象模式')
        
        var result = (function () { return _.intersection(arguments, leaders) })('moe', 'curly', 'larry')
        assert.deepEqual(result, ['moe'], '对arguments奏效')

        stooge = ['moe', 'moe', 'curly', 'curly', 'larry', 'larry']
        assert.deepEqual(_.intersection(stooge, leaders), ['moe'])

        assert.deepEqual(_.intersection([2, 4, 3, 1], [1, 2, 3]), [2, 3, 1], '按照第一个数组的顺序排序')
        assert.deepEqual(_.intersection(null, [1, 2, 3]), [], '当传入null作为第一个参数时，返回空数组')
        assert.deepEqual(_.intersection([1, 2, 3], null), [], '当传入null作为非第一个参数时，返回空数组')
    })

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
        assert.strictEqual(_.findLastIndex(null, _.noop), -1)

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

        numbers = [1, 40, 40, 40, 40, 40, 40, 40, 50, 60, 70]
        num = 40
        assert.strictEqual(_.indexOf(numbers, num, true), 1, '40在列表中')
        assert.strictEqual(_.indexOf(numbers, 6, true), -1, '6不在列表中')
        assert.strictEqual(_.indexOf([1, 2, 5, 4, 6, 7], 5, true), -1, '非有序数组传入true会导致查找错误')
        assert.ok(_.every(['1', [], {}, null], function () {
            return _.indexOf(numbers, num, {}) === 1
        }))

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

    QUnit.test('lastIndexOf', function (assert) {
        var numbers = [1, 0, 1]
        assert.strictEqual(_.lastIndexOf(numbers, 1), 2)

        numbers = [1, 0, 1, 0, 0, 1, 0, 0, 0]
        numbers.lastIndexOf = null
        assert.strictEqual(_.lastIndexOf(numbers, 1), 5, '可以计算lastIndexOf，即使没有原生方法')
        assert.strictEqual(_.lastIndexOf(numbers, 0), 8)

        var result = (function () {
            return _.lastIndexOf(arguments, 1)
        })(1, 0, 1, 0, 0, 1, 0, 0, 0)
        assert.strictEqual(result, 5, '对arguments可行')

        var falsy = [void 0, '', 0, false, NaN, null]
        _.each(falsy, function (val) {
            var msg = 'Handles: ' + (_.isArray(val) ? '[]' : val)
            assert.strictEqual(_.lastIndexOf(val, 2), -1, msg)
            assert.strictEqual(_.lastIndexOf(val, 2, -1), -1, msg)
            assert.strictEqual(_.lastIndexOf(val, 2, -20), -1, msg)
            assert.strictEqual(_.lastIndexOf(val, 2, 15), -1, msg)
        })

        numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3]
        assert.strictEqual(_.lastIndexOf(numbers, 2, 2), 1, '支持fromIndex参数')
        
        numbers = [1, 2, 3, 1, 2, 3]
        assert.strictEqual(_.lastIndexOf(numbers, 1, 0), 0, 'fromIndex为0')
        assert.strictEqual(_.lastIndexOf(numbers, 3), 5)
        assert.strictEqual(_.lastIndexOf(numbers, 4), -1)
        assert.strictEqual(_.lastIndexOf(numbers, 1, 2), 0)

        _.each([6, 8, Math.pow(2, 32), Infinity], function (fromIndex) {
            assert.strictEqual(_.lastIndexOf(numbers, void 0, fromIndex), -1)
            assert.strictEqual(_.lastIndexOf(numbers, 1, fromIndex), 3)
            assert.strictEqual(_.lastIndexOf(numbers, '', fromIndex), -1)
        })

        var expected = _.map(falsy, function (val) {
            return typeof val === 'number' ? -1 : 5
        })
        var actual = _.map(falsy, function (fromIndex) {
            return _.lastIndexOf(numbers, 3, fromIndex)
        })
        assert.deepEqual(actual, expected, '可以对待falsy的fromIndex')
        assert.strictEqual(_.lastIndexOf(numbers, 3, '1'), -1, '原underscore无视数字字符串，我按照chrome表现处理为数字')
        assert.strictEqual(_.lastIndexOf(numbers, 3, true), 5)
        assert.strictEqual(_.lastIndexOf(numbers, 2, -3), 1)
        assert.strictEqual(_.lastIndexOf(numbers, 1, -3), 3)
        assert.deepEqual(_.map([-6, -8, -Infinity], function (fromIndex) {
            return _.lastIndexOf(numbers, 1, fromIndex)
        }), [0, -1, -1])
    })

    QUnit.test('range', function (assert) {
        assert.deepEqual(_.range(0), [], '唯一参数0，range返回空数组')
        assert.deepEqual(_.range(4), [0, 1, 2, 3], '单一正参数，range生成0...n-1')
        assert.deepEqual(_.range(5, 8), [5, 6, 7], '两个参数a&b，a<b，生成a...b-1')
        assert.deepEqual(_.range(3, 10, 3), [3, 6, 9], '三个参数a&b&c，c<b-a，a<b，生成a,a+c...b-(n*a)<c')
        assert.deepEqual(_.range(3, 10, 15), [3], '三个参数a&b&c，c>b-a，a<b，生成只包含一个元素的数组，元素等于a')
        assert.deepEqual(_.range(12, 7, -2), [12, 10, 8], '三个参数a&b&c，a>b，c<0，生成数组a,a-c,a-2c...以不小于b的数字结束')
        assert.deepEqual(_.range(0, -10, -1), [0, -1, -2, -3, -4, -5, -6, -7, -8, -9])
        assert.strictEqual(1 / _.range(-0, 1)[0], -Infinity)
        assert.deepEqual(_.range(8, 5), [8, 7, 6], 'stop>start则倒数')
        assert.deepEqual(_.range(-3), [0, -1, -2], 'stop>start则倒数，默认start不例外')
    })
})()