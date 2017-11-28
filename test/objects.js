;(function () {
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
        assert.deepEqual(_.keys(fn), ['a', 'b'], '能够取得函数的key')

        var trouble = {
            constructor: Object,
            valueOf: function () {},
            hasOwnProperty: null,
            toString: 5,
            toLocaleString: void 0,
            propertyIsEnumerable: /a/,
            isPrototypeOf: this,
            __defineGetter__: Boolean,
            __defineSetter__: {},
            __lookupSetter__: false,
            __lookupGetter__: []
        }
        var troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable', 'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'].sort()
        assert.deepEqual(_.keys(trouble).sort(), troubleKeys, '能够符合不可枚举属性')
    })

    QUnit.test('allKeys', function (assert) {
        assert.deepEqual(_.allKeys({ one: 1, two: 2 }), ['one', 'two'], '可以从对象中提取出key')
        var arr = []
        arr[1] = 0
        assert.deepEqual(_.allKeys(arr), ['1'], '不会被稀疏数组所愚弄')
        assert.deepEqual(_.allKeys(null), [])
        assert.deepEqual(_.allKeys(void 0), [])
        assert.deepEqual(_.allKeys(1), [])
        assert.deepEqual(_.allKeys('a'), [])
        assert.deepEqual(_.allKeys(true), [])

        var fn = function () {}
        fn.a = 'b'
        fn.b = 'c'
        assert.deepEqual(_.allKeys(fn), ['a', 'b'], '能够取得函数的key')

        var trouble = {
            constructor: Object,
            valueOf: function () {},
            hasOwnProperty: null,
            toString: 5,
            toLocaleString: void 0,
            propertyIsEnumerable: /a/,
            isPrototypeOf: this,
            __defineGetter__: Boolean,
            __defineSetter__: {},
            __lookupSetter__: false,
            __lookupGetter__: []
        }
        var troubleKeys = ['constructor', 'valueOf', 'hasOwnProperty', 'toString', 'toLocaleString', 'propertyIsEnumerable', 'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'].sort()
        assert.deepEqual(_.allKeys(trouble).sort(), troubleKeys, '能够符合不可枚举属性')

        function A () {}
        A.prototype.foo = 'foo'
        var b = new A()
        b.bar = 'bar'
        assert.deepEqual(_.allKeys(b).sort(), ['bar', 'foo'], '应该包括继承的key')
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

        testElement && assert.notOk(_.isFunction(testElement), '元素不是函数')

        var nodeList = typeof document !== 'undefined' && document.childNodes
        nodeList && assert.notOk(_.isFunction(nodeList))
    })

    QUnit.test('valus', function (assert) {
        assert.deepEqual(_.values({ one: 1, two: 2 }), [1, 2])
        assert.deepEqual(_.values({ one: 1, two: 2, length: 3 }), [1, 2, 3])
    })

    QUnit.test('property', function (assert) {
        var stooge = {
            name: 'moe',
            null: 'nullVal',
            undefined: 'undefinedVal'
        }
        assert.strictEqual(_.property('name')(stooge), 'moe', '应返回给出名字的属性')
        assert.strictEqual(_.property('name')(null), void 0, '应为null对象的name属性返回undefined')
        assert.strictEqual(_.property('name')(void 0), void 0, '应为undefined对象的name属性返回undefined')
        // 原例默认stooge[null] === undefined，可是null也能作为属性名（会被处理为字符串，即stooge[null] === stooge['null']）
        assert.strictEqual(_.property(null)(stooge), 'nullVal', '应为stooge对象的null属性返回undefined')
        assert.strictEqual(_.property('x')({ x: null }), null, '可以返回null属性值')
        assert.strictEqual(_.property(['a', 'b'])({ a: { b: 2 } }), 2, '可以获取嵌套属性')
        assert.strictEqual(_.property(['a'])({ a: false }), false, '可以获取false值')
        assert.strictEqual(_.property(['a', 'b'])({ a: { b: null } }), null, '可以获取嵌套属性的null值')
        assert.strictEqual(_.property([])({ x: 'y' }), void 0, '获取路径为空数组时返回undefined')
    })

    QUnit.test('extend', function (assert) {
        var result
        assert.strictEqual(_.extend({}, { a: 'b' }).a, 'b')
        assert.strictEqual(_.extend({ a: 'x' }, { a: 'b' }).a, 'b', '会被重写')
        assert.strictEqual(_.extend({ x: 'x' }, { a: 'b' }).x, 'x', '原本没有在对象里的属性不会被重写')
        result = _.extend({ x: 'x' }, { a: 'a' }, { b: 'b' })
        assert.deepEqual(result, { x: 'x', a: 'a', b: 'b' }, '能够从多个源对象继承')
        result = _.extend({ x: 'x' }, { a: 'a', x: 2 }, { a: 'b' })
        assert.deepEqual(result, { x: 2, a: 'b' }, '继承多个源对象也是保留最后一个属性')
        assert.deepEqual(_.extend({}, { a: void 0, b: null }), { a: void 0, b: null }, '可以复制undefined值')

        var F = function () {}
        F.prototype = { a: 'b' }
        var subObj = new F()
        subObj.c = 'd'
        assert.deepEqual(_.extend({}, subObj), { a: 'b', c: 'd' }, '复制原型属性')
        _.extend(subObj, {})
        assert.notOk(subObj.hasOwnProperty('a'), 'extend方法不会将原型链上的属性放入自身属性')
        
        result = {}
        // 此条其实依赖于_.keys中做出的_.isObject的判断
        assert.deepEqual(_.extend(result, null, void 0, { a: 1 }), { a: 1 }, '不应在源对象为null或undefined时报错')

        _.each(['a', 5, null, false, void 0], function (val) {
            assert.strictEqual(_.extend(val, { a: 1 }), val, '如果是用非object继承，返回非object值')
        })

        // 反正根据underscore的判断标准，只要有数字类型的length值的对象就是array-like对象
        result = _.extend({ a: 1, 0: 2, 1: '5', length: 6 }, { 0: 1, 1: 2, length: 2 })
        assert.deepEqual(result, { a: 1, 0: 1, 1: 2, length: 2 }, '处理array-like对象应像普通对象一样')
    })

    QUnit.test('extendOwn', function (assert) {
        var result
        assert.strictEqual(_.extendOwn({}, { a: 'b' }).a, 'b')
        assert.strictEqual(_.extendOwn({ a: 'x' }, { a: 'b' }).a, 'b', '会被重写')
        assert.strictEqual(_.extendOwn({ x: 'x' }, { a: 'b' }).x, 'x', '原本没有在对象里的属性不会被重写')
        result = _.extendOwn({ x: 'x' }, { a: 'a' }, { b: 'b' })
        assert.deepEqual(result, { x: 'x', a: 'a', b: 'b' }, '能够从多个源对象继承')
        result = _.extendOwn({ x: 'x' }, { a: 'a', x: 2 }, { a: 'b' })
        assert.deepEqual(result, { x: 2, a: 'b' }, '继承多个源对象也是保留最后一个属性')
        assert.deepEqual(_.extendOwn({}, { a: void 0, b: null }), { a: void 0, b: null }, '可以复制undefined值')

        var F = function () {}
        F.prototype = { a: 'b' }
        var subObj = new F()
        subObj.c = 'd'
        assert.deepEqual(_.extendOwn({}, subObj), { c: 'd' }, '只复制自有属性，即不复制原型属性')
        
        result = {}
        // 此条其实依赖于_.keys中做出的_.isObject的判断
        assert.deepEqual(_.extendOwn(result, null, void 0, { a: 1 }), { a: 1 }, '不应在源对象为null或undefined时报错')

        _.each(['a', 5, null, false, void 0], function (val) {
            assert.strictEqual(_.extendOwn(val, { a: 1 }), val, '如果是用非object继承，返回非object值')
        })

        // 反正根据underscore的判断标准，只要有数字类型的length值的对象就是array-like对象
        result = _.extendOwn({ a: 1, 0: 2, 1: '5', length: 6 }, { 0: 1, 1: 2, length: 2 })
        assert.deepEqual(result, { a: 1, 0: 1, 1: 2, length: 2 }, '处理array-like对象应像普通对象一样')
    })

    QUnit.test('isMatch', function (assert) {
        var moe = { name: 'Moe Howard', hair: true },
            curly = { name: 'Curly Howard', hair: false }
        assert.strictEqual(_.isMatch(moe, { hair: true }), true)
        assert.strictEqual(_.isMatch(curly, { hair: true }), false)
        assert.strictEqual(_.isMatch(5, { __x__: void 0 }), false, '可以在原始类型上匹配undefined属性值')
        assert.strictEqual(_.isMatch({ __x__: void 0 }, { __x__: void 0 }), true, '可以匹配undefined属性值')
        assert.strictEqual(_.isMatch(null, {}), true)
        assert.strictEqual(_.isMatch(null, { a: 1 }), false)

        _.each([null, void 0], function (item) {
            assert.strictEqual(_.isMatch(item, null), true, 'null匹配null')
        })
        _.each([null, void 0], function (item) {
            assert.strictEqual(_.isMatch(item, {}), true, '{}匹配null')
        })
        assert.strictEqual(_.isMatch({ b: 1 }, { a: void 0 }), false)
        _.each([true, 5, NaN, null, void 0], function (item) {
            assert.strictEqual(_.isMatch({ a: 1 }, item), true, '将原始值当做空来处理')
        })

        function F () {}
        F.prototype.x = 1
        var subObj = new F()
        assert.strictEqual(_.isMatch({ x: 2 }, subObj), true, '需要查找的对象，其属性不包括原型属性')
        subObj.y = 5
        assert.strictEqual(_.isMatch({ x: 1, y: 5 }, subObj), true)
        assert.strictEqual(_.isMatch({ x: 1, y: 4 }, subObj), false)
        assert.ok(_.isMatch(subObj, { x: 1, y: 5 }), true, '但是被检测的对象，被检测属性包括原型属性')
        F.x = 5
        assert.ok(_.isMatch({ x: 5, y: 1 }, F), '需要查找的对象可以是一个函数')

        // null的边界测试。能够通过测试主要是因为isMatch里指明如果被测试值为空且测试值不为空，返回false
        var oCon = {
            constructor: Object
        }
        assert.deepEqual(_.map([null, void 0, 5, {}], _.partial(_.isMatch, _, oCon)), [false, false, false, true])
    })

    QUnit.test('matcher', function (assert) {
        var moe = { name: 'Moe Howard', hair: true },
            curly = { name: 'Curly Howard', hair: false },
            stooges = [moe, curly]
        assert.strictEqual(_.matcher({ hair: true })(moe), true, '返回一个布尔值')
        assert.strictEqual(_.matcher({ hair: true })(curly), false, '返回一个布尔值')

        assert.strictEqual(_.matcher({ __x__: void 0 })(5), false, '可以匹配在基本类型未定义的属性值')
        assert.strictEqual(_.matcher({ __x__: void 0 })({ __x__: void 0 }), true, '可以匹配未定义的属性值')
        assert.strictEqual(_.matcher({})(null), true, '空规则对空对象返回true')
        assert.strictEqual(_.matcher({ a: 1 })(null), false, '空规则对非空对象返回false')
    })
})()