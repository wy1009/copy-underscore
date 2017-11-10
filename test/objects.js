(function () {
    var testElement = typeof document === 'object' ? document.createElement('div') : void 0

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
        fn.b = 'c'
        assert.deepEqual(_.keys(fn), ['a', 'b'])
    })

    QUnit.test('isObject', function (assert) {
        assert.ok(_.isObject(arguments), 'arguments是object')
        assert.ok(_.isObject([1, 2, 3]), '数组是object')
        if (testElement) {
            assert.ok(_.isObject(testElement), 'DOM元素是对象')
        }
        assert.ok(_.isObject(function () {}), '函数是对象')
        assert.notOk(_.isObject(null), 'null不是对象')
        assert.notOk(_.isObject(void 0), 'undefined不是对象')
        assert.notOk(_.isObject('string'), 'string不是对象')
        assert.notOk(_.isObject(12), 'number不是对象')
        assert.notOk(_.isObject(true), 'true不是对象')
        // new新建实例对象，因此是一个对象
        assert.ok(_.isObject(new String()), 'new String()是对象')
    })

    QUnit.test('has', function (assert) {
        var obj = {
            foo: 'bar',
            func: function () {}
        }
        assert.ok(_.has(obj, 'foo'), '检查obj中有一个属性')
        assert.notOk(_.has(obj, 'baz'), '没有该属性则返回false')
        assert.ok(_.has(obj, 'func'))
        obj.hasOwnProperty = null
        assert.ok(_.has(obj, 'foo'), '在hasOwnProperty方法被删除后已经奏效，因为采用了借用原型方法的写法')

        function Child () {}
        Child.prototype = obj
        var child = new Child()
        // 原代码测试用例好像写错了，`var child = {}; child.prototype = obj`并不意味着obj在child的原型链上，只是为child新增了一个名叫“prototype”的属性
        assert.notOk(_.has(child, 'foo'), '原型链上的属性不会被检测出')
        assert.strictEqual(_.has(null, 'foo'), false, '在检测null时return false')
        assert.strictEqual(_.has(void 0, 'foo'), false, '在检测undefined时return false')
        assert.ok(_.has({ a: { b: 'c' } }, ['a', 'b']), true, '可以检测嵌套属性')
        assert.notOk(_.has({ a: child }), ['a', 'foo'], '不会检测嵌套属性的prototype')
    })

    QUnit.test('isArray', function (assert) {
        assert.notOk(_.isArray(void 0), 'undefined不是数组')
        assert.notOk(_.isArray(arguments), 'arguments不是数组')
        assert.ok(_.isArray([1, 2, 3]), '可以检测数组')
    })

    QUnit.test('isFunction', function (assert) {
        assert.notOk(_.isFunction(void 0), 'undefined不是函数')
        assert.notOk(_.isFunction([1, 2, 3]), '数组不是函数')
        assert.notOk(_.isFunction('moe'), '字符串不是函数')
        assert.ok(_.isFunction(_.isFunction), '函数是函数')
        assert.ok(_.isFunction(function () {}), '匿名函数是函数')

        if (testElement) {
            assert.notOk(_.isFunction(testElement), '元素不是函数')
        }

        var nodeList = typeof document !== 'undefined' && document.childNodes
        assert.notOk(_.isFunction(nodeList))
    })

    QUnit.test('valus', function (assert) {
        assert.deepEqual(_.values({ one: 1, two: 2 }), [1, 2])
        assert.deepEqual(_.values({ one: 1, two: 2, length: 3 }), [1, 2, 3])
    })
})()