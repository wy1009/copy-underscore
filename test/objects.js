; (function () {
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

    var fn = function () { }
    fn.a = 'b'
    fn.b = 'c'
    assert.deepEqual(_.keys(fn), ['a', 'b'], '能够取得函数的key')

    var trouble = {
      constructor: Object,
      valueOf: _.noop,
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

    var fn = function () { }
    fn.a = 'b'
    fn.b = 'c'
    assert.deepEqual(_.allKeys(fn), ['a', 'b'], '能够取得函数的key')

    var trouble = {
      constructor: Object,
      valueOf: function () { },
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

    function A() { }
    A.prototype.foo = 'foo'
    var b = new A()
    b.bar = 'bar'
    assert.deepEqual(_.allKeys(b).sort(), ['bar', 'foo'], '应该包括继承的key')
  })

  QUnit.test('valus', function (assert) {
    assert.deepEqual(_.values({ one: 1, two: 2 }), [1, 2])
    assert.deepEqual(_.values({ one: 1, two: 2, length: 3 }), [1, 2, 3])
  })

  QUnit.test('mapObject', function (assert) {
    var obj = { a: 1, b: 2 }
    var objects = {
      a: { a: 0, b: 0 },
      b: { a: 1, b: 1 },
      c: { a: 2, b: 2 }
    }

    assert.deepEqual(_.mapObject(obj, function (val) {
      return val * 2
    }), { a: 2, b: 4 }, 'simple objects')

    assert.deepEqual(_.mapObject(objects, function (val) {
      return _.reduce(val, function (memo, v) {
        return memo + v
      }, 0)
    }), { a: 0, b: 2, c: 4 }, 'nested objects')

    assert.deepEqual(_.mapObject(obj, function (val, key, o) {
      return o[key] * 2
    }), { a: 2, b: 4 }, 'correct keys')

    assert.deepEqual(_.mapObject([1, 2], function (val) {
      return val * 2
    }), { 0: 2, 1: 4 }, 'check behavior for arrays')

    assert.deepEqual(_.mapObject(obj, function (val) {
      return val * this.multiplier
    }, { multiplier: 3 }), { a: 3, b: 6 }, 'keep context')

    assert.deepEqual(_.mapObject({ a: 1 }, function () {
      return this.length
    }, [1, 2]), { a: 2 }, 'called with context')

    var ids = _.mapObject({ length: 2, 0: { id: '1' }, 1: { id: '2' } }, function (n) {
      return n.id
    })
    assert.deepEqual(ids, { length: void 0, 0: '1', 1: '2' }, 'Check with array-like objects')

    // Passing a property name like _.pluck.
    var people = { a: { name: 'moe', age: 30 }, b: { name: 'curly', age: 50 } }
    assert.deepEqual(_.mapObject(people, 'name'), { a: 'moe', b: 'curly' }, 'predicate string map to object properties')

    _.each([null, void 0, 1, 'abc', [], {}, void 0], function (val) {
      assert.deepEqual(_.mapObject(val, _.identity), {}, 'mapValue identity')
    })

    var Proto = function () { this.a = 1 }
    Proto.prototype.b = 1
    var protoObj = new Proto()
    assert.deepEqual(_.mapObject(protoObj, _.identity), { a: 1 }, 'ignore inherited values from prototypes')
  })

  QUnit.test('pairs', function (assert) {
    assert.deepEqual(_.pairs({ one: 1, two: 2 }), [['one', 1], ['two', 2]], 'can convert an object into pairs')
    assert.deepEqual(_.pairs({ one: 1, two: 2, length: 3 }), [['one', 1], ['two', 2], ['length', 3]], '... even when one of them is "length"')
  })

  QUnit.test('invert', function (assert) {
    var obj = { first: 'Moe', second: 'Larry', third: 'Curly' }
    assert.deepEqual(_.keys(_.invert(obj)), ['Moe', 'Larry', 'Curly'], 'can invert an object')
    assert.deepEqual(_.invert(_.invert(obj)), obj, 'two inverts gets you back where you started')

    obj = { length: 3 }
    assert.strictEqual(_.invert(obj)['3'], 'length', 'can invert an object with "length"')
  })

  QUnit.test('create', function (assert) {
    var Parent = function () { };
    Parent.prototype = { foo: function () { }, bar: 2 };

    _.each(['foo', null, void 0, 1], function (val) {
      assert.deepEqual(_.create(val), {}, 'should return empty object when a non-object is provided');
    });

    assert.ok(_.create([]) instanceof Array, 'should return new instance of array when array is provided');

    var Child = function () { };
    Child.prototype = _.create(Parent.prototype);
    assert.ok(new Child instanceof Parent, 'object should inherit prototype');

    var func = function () { };
    Child.prototype = _.create(Parent.prototype, { func: func });
    assert.strictEqual(Child.prototype.func, func, 'properties should be added to object');

    Child.prototype = _.create(Parent.prototype, { constructor: Child });
    assert.strictEqual(Child.prototype.constructor, Child);

    Child.prototype.foo = 'foo';
    var created = _.create(Child.prototype, new Child);
    assert.notOk(created.hasOwnProperty('foo'), 'should only add own properties');
  })

  QUnit.test('functions', function (assert) {
    var obj = { a: 'dash', b: _.map, c: /yo/, d: _.reduce }
    assert.deepEqual(['b', 'd'], _.functions(obj), '可以获得传入对象的方法名')

    var Animal = function () { }
    Animal.prototype.run = function () { }
    assert.deepEqual(_.functions(new Animal), ['run'], '也会注意原型上的方法')
  })

  QUnit.test('findKey', function (assert) {
    var objs = {
      a: { a: 0, b: 0 },
      b: { a: 1, b: 1 },
      c: { a: 2, b: 2 }
    }
    assert.strictEqual(_.findKey(objs, function (obj) {
      return obj.a === 0
    }), 'a')
    assert.strictEqual(_.findKey(objs, function (obj) {
      return obj.b * obj.a === 4
    }), 'c')
    assert.strictEqual(_.findKey(objs, 'a'), 'b')
    assert.strictEqual(_.findKey(objs, function (obj) {
      return obj.b * obj.a === 5
    }), void 0)
    assert.strictEqual(_.findKey([1, 2, 3, 4, 5, 6], function (obj) {
      return obj === 3
    }), '2', '对array生效')
    assert.strictEqual(_.findKey(objs, function (obj) {
      return obj.foo === null
    }), void 0)
    _.findKey({ a: { a: 1 } }, function (val, key, obj) {
      assert.strictEqual(key, 'a')
      assert.deepEqual(obj, { a: { a: 1 } })
      assert.strictEqual(this, objs, '执行上下文')
    }, objs)

    var arr = [1, 2, 3]
    arr.match = 55
    assert.strictEqual(_.findKey(arr, function (x) {
      return x === 55
    }), 'match', '匹配array-like的key') // arr -> [ 0: 1, 1: 2, 2: 3, match: 55, length: 3 ]
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

    var F = function () { }
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

    var F = function () { }
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

  QUnit.test('pick', function (assert) {
    var result;
    result = _.pick({ a: 1, b: 2, c: 3 }, 'a', 'c');
    assert.deepEqual(result, { a: 1, c: 3 }, 'can restrict properties to those named');
    result = _.pick({ a: 1, b: 2, c: 3 }, ['b', 'c']);
    assert.deepEqual(result, { b: 2, c: 3 }, 'can restrict properties to those named in an array');
    result = _.pick({ a: 1, b: 2, c: 3 }, ['a'], 'b');
    assert.deepEqual(result, { a: 1, b: 2 }, 'can restrict properties to those named in mixed args');
    result = _.pick(['a', 'b'], 1);
    assert.deepEqual(result, { 1: 'b' }, 'can pick numeric properties');

    _.each([null, void 0], function (val) {
      assert.deepEqual(_.pick(val, 'hasOwnProperty'), {}, 'Called with null/undefined');
      assert.deepEqual(_.pick(val, _.constant(true)), {});
    });
    assert.deepEqual(_.pick(5, 'toString', 'b'), { toString: Number.prototype.toString }, 'can iterate primitives');

    var data = { a: 1, b: 2, c: 3 };
    var callback = function (value, key, object) {
      assert.strictEqual(key, { 1: 'a', 2: 'b', 3: 'c' }[value]);
      assert.strictEqual(object, data);
      return value !== this.value;
    };
    result = _.pick(data, callback, { value: 2 });
    assert.deepEqual(result, { a: 1, c: 3 }, 'can accept a predicate and context');

    var Obj = function () { };
    Obj.prototype = { a: 1, b: 2, c: 3 };
    var instance = new Obj();
    assert.deepEqual(_.pick(instance, 'a', 'c'), { a: 1, c: 3 }, 'include prototype props');

    assert.deepEqual(_.pick(data, function (val, key) {
      return this[key] === 3 && this === instance;
    }, instance), { c: 3 }, 'function is given context');

    assert.notOk(_.has(_.pick({}, 'foo'), 'foo'), 'does not set own property if property not in object');
    _.pick(data, function (value, key, obj) {
      assert.strictEqual(obj, data, 'passes same object as third parameter of iteratee');
    });
  })

  QUnit.test('omit', function (assert) {
    var result;
    result = _.omit({ a: 1, b: 2, c: 3 }, 'b');
    assert.deepEqual(result, { a: 1, c: 3 }, 'can omit a single named property');
    result = _.omit({ a: 1, b: 2, c: 3 }, 'a', 'c');
    assert.deepEqual(result, { b: 2 }, 'can omit several named properties');
    result = _.omit({ a: 1, b: 2, c: 3 }, ['b', 'c']);
    assert.deepEqual(result, { a: 1 }, 'can omit properties named in an array');
    result = _.omit(['a', 'b'], 0);
    assert.deepEqual(result, { 1: 'b' }, 'can omit numeric properties');

    assert.deepEqual(_.omit(null, 'a', 'b'), {}, 'non objects return empty object');
    assert.deepEqual(_.omit(void 0, 'toString'), {}, 'null/undefined return empty object');
    assert.deepEqual(_.omit(5, 'toString', 'b'), {}, 'returns empty object for primitives');

    var data = { a: 1, b: 2, c: 3 };
    var callback = function (value, key, object) {
      assert.strictEqual(key, { 1: 'a', 2: 'b', 3: 'c' }[value]);
      assert.strictEqual(object, data);
      return value !== this.value;
    };
    result = _.omit(data, callback, { value: 2 });
    assert.deepEqual(result, { b: 2 }, 'can accept a predicate');

    var Obj = function () { };
    Obj.prototype = { a: 1, b: 2, c: 3 };
    var instance = new Obj();
    assert.deepEqual(_.omit(instance, 'b'), { a: 1, c: 3 }, 'include prototype props');

    assert.deepEqual(_.omit(data, function (val, key) {
      return this[key] === 3 && this === instance;
    }, instance), { a: 1, b: 2 }, 'function is given context');
  })

  QUnit.test('defaults', function (assert) {
    var options = { zero: 0, one: 1, empty: '', nan: NaN, nothing: null };

    _.defaults(options, { zero: 1, one: 10, twenty: 20, nothing: 'str' });
    assert.strictEqual(options.zero, 0, 'value exists');
    assert.strictEqual(options.one, 1, 'value exists');
    assert.strictEqual(options.twenty, 20, 'default applied');
    assert.strictEqual(options.nothing, null, "null isn't overridden");

    _.defaults(options, { empty: 'full' }, { nan: 'nan' }, { word: 'word' }, { word: 'dog' });
    assert.strictEqual(options.empty, '', 'value exists');
    assert.ok(_.isNaN(options.nan), "NaN isn't overridden");
    assert.strictEqual(options.word, 'word', 'new value is added, first one wins');

    try {
      options = {};
      _.defaults(options, null, void 0, { a: 1 });
    } catch (e) { /* ignored */ }

    assert.strictEqual(options.a, 1, 'should not error on `null` or `undefined` sources');

    assert.deepEqual(_.defaults(null, { a: 1 }), { a: 1 }, 'defaults skips nulls');
    assert.deepEqual(_.defaults(void 0, { a: 1 }), { a: 1 }, 'defaults skips undefined');
  })

  QUnit.test('clone', function (assert) {
    var moe = { name: 'moe', lucky: [13, 27, 34] }
    var clone = _.clone(moe)
    assert.strictEqual(clone.name, 'moe')

    clone.name = 'curly'
    assert.ok(clone.name === 'curly' && moe.name === 'moe', '克隆体可以更改浅属性，不影响本体')

    clone.lucky.push(101)
    assert.strictEqual(_.last(moe.lucky), 101, '对引用属性的改变与原对象共享')

    assert.strictEqual(_.clone(void 0), void 0, '原始类型不会被改变')
    assert.strictEqual(_.clone(1), 1, '原始类型不会被改变')
    assert.strictEqual(_.clone(null), null, '原始类型不会被改变')
  })

  QUnit.test('cloneDeep', function (assert) {
    var moe = { name: 'moe', lucky: [13, 27, 34], feature: { hair: true } }
    var clone = _.cloneDeep(moe)
    assert.strictEqual(clone.name, 'moe')

    clone.name = 'curly'
    assert.ok(clone.name === 'curly' && moe.name === 'moe', '克隆体可以更改浅属性，不影响本体')

    clone.lucky.push(101)
    assert.strictEqual(_.last(moe.lucky), 34, '对引用属性的改变不与原对象共享')
    clone.feature.hair = false
    assert.strictEqual(moe.feature.hair, true)
    assert.notStrictEqual(moe, clone)
    assert.notStrictEqual(moe.lucky, clone.lucky)
    assert.notStrictEqual(moe.feature, clone.feature)

    assert.strictEqual(_.cloneDeep(void 0), void 0, '原始类型不会被改变')
    assert.strictEqual(_.cloneDeep(1), 1, '原始类型不会被改变')
    assert.strictEqual(_.cloneDeep(null), null, '原始类型不会被改变')
  })

  QUnit.test('has', function (assert) {
    var obj = {
      foo: 'bar',
      func: function () { }
    }
    assert.ok(_.has(obj, 'foo'), '检查obj中有一个属性')
    assert.notOk(_.has(obj, 'baz'), '没有该属性则返回false')
    assert.ok(_.has(obj, 'func'))
    obj.hasOwnProperty = null
    assert.ok(_.has(obj, 'foo'), '在hasOwnProperty方法被删除后已经奏效，因为采用了借用原型方法的写法')

    function Child() { }
    Child.prototype = obj
    var child = new Child()
    // 原代码测试用例好像写错了，`var child = {}; child.prototype = obj`并不意味着obj在child的原型链上，只是为child新增了一个名叫“prototype”的属性
    assert.notOk(_.has(child, 'foo'), '原型链上的属性不会被检测出')
    assert.strictEqual(_.has(null, 'foo'), false, '在检测null时return false')
    assert.strictEqual(_.has(void 0, 'foo'), false, '在检测undefined时return false')
    assert.ok(_.has({ a: { b: 'c' } }, ['a', 'b']), true, '可以检测嵌套属性')
    assert.notOk(_.has({ a: child }), ['a', 'foo'], '不会检测嵌套属性的prototype')
  })

  QUnit.test('tap', function (assert) {
    var intercepted = null;
    var interceptor = function (obj) { intercepted = obj; };
    var returned = _.tap(1, interceptor);
    assert.strictEqual(intercepted, 1, 'passes tapped object to interceptor');
    assert.strictEqual(returned, 1, 'returns tapped object');

    returned = _([1, 2, 3]).chain().
      map(function (n) { return n * 2; }).
      max().
      tap(interceptor).
      value();
    assert.strictEqual(returned, 6, 'can use tapped objects in a chain');
    assert.strictEqual(intercepted, returned, 'can use tapped objects in a chain');
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
    assert.strictEqual(_.find(stooges, _.matcher({ hair: false })), curly, '返回一个可以被用于查找的断言函数')
    assert.strictEqual(_.find(stooges, _.matcher(moe)), moe, '可以被用于定位一个已经在集合中的对象')

    var falsy = [null, void 0]
    assert.deepEqual(_.filter(falsy, _.matcher({ a: 1 })), [], '空值不会出错')
    assert.deepEqual(_.filter(falsy, _.matcher({})), falsy, 'null matches {}')
    assert.deepEqual(_.filter(falsy, _.matcher(null)), falsy, 'null matches null')
    assert.deepEqual(_.filter([{ b: 1 }], _.matcher({ a: void 0 })), [], '可以处理undefined值')

    _.each([true, 5, NaN, null, void 0], function (item) {
      assert.strictEqual(_.matcher(item)({ a: 1 }), true, '对待原始类型像空值一样')
    })

    function Prototest() { }
    Prototest.prototype.x = 1
    var specObj = new Prototest(),
      protospec = _.matcher(specObj)
    assert.strictEqual(protospec({ x: 2 }), true, '检索值不包括原型上的可枚举值')

    specObj.y = 5
    protospec = _.matcher(specObj)
    assert.strictEqual(protospec({ x: 1, y: 5 }), true)
    assert.strictEqual(protospec({ x: 1, y: 4 }), false)
    assert.ok(_.matcher({ x: 1, y: 5 })(specObj), '被检索值包括原型上的可枚举属性')

    Prototest.x = 5
    assert.ok(_.matcher(Prototest)({ x: 5, y: 1 }), '可以是一个function')

    var obj = { b: 1 },
      matcher = _.matcher(obj)
    assert.strictEqual(matcher({ b: 1 }), true)
    obj.b = 2
    obj.a = 1
    assert.strictEqual(matcher({ b: 1 }), true, '改变检索对象不会改变被检索的结果')

    var oCon = _.matcher({ constructor: Object })
    assert.deepEqual(_.map([null, void 0, 5, {}], oCon), [false, false, false, true], '不会在undefined或null值上错误地匹配constructor')
  })

  QUnit.test('matches', function (assert) {
    assert.strictEqual(_.matches, _.matcher, '是matcher的别名')
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

  QUnit.test('propertyOf', function (assert) {
    var stoogeRanks = _.propertyOf({ curly: 2, moe: 1, larry: 3 });
    assert.strictEqual(stoogeRanks('curly'), 2, 'should return the property with the given name');
    assert.strictEqual(stoogeRanks(null), void 0, 'should return undefined for null values');
    assert.strictEqual(stoogeRanks(void 0), void 0, 'should return undefined for undefined values');
    assert.strictEqual(_.propertyOf({ a: null })('a'), null, 'can fetch null values');

    function MoreStooges() { this.shemp = 87; }
    MoreStooges.prototype = { curly: 2, moe: 1, larry: 3 };
    var moreStoogeRanks = _.propertyOf(new MoreStooges());
    assert.strictEqual(moreStoogeRanks('curly'), 2, 'should return properties from further up the prototype chain');

    var nullPropertyOf = _.propertyOf(null);
    assert.strictEqual(nullPropertyOf('curly'), void 0, 'should return undefined when obj is null');

    var undefPropertyOf = _.propertyOf(void 0);
    assert.strictEqual(undefPropertyOf('curly'), void 0, 'should return undefined when obj is undefined');

    var deepPropertyOf = _.propertyOf({ curly: { number: 2 }, joe: { number: null } });
    assert.strictEqual(deepPropertyOf(['curly', 'number']), 2, 'can fetch nested properties of obj');
    assert.strictEqual(deepPropertyOf(['joe', 'number']), null, 'can fetch nested null properties of obj');
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

    function F() { }
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

  QUnit.test('isEmpty', function (assert) {
    assert.notOk(_([1]).isEmpty(), '[1] is not empty');
    assert.ok(_.isEmpty([]), '[] is empty');
    assert.notOk(_.isEmpty({ one: 1 }), '{one: 1} is not empty');
    assert.ok(_.isEmpty({}), '{} is empty');
    assert.ok(_.isEmpty(new RegExp('')), 'objects with prototype properties are empty');
    assert.ok(_.isEmpty(null), 'null is empty');
    assert.ok(_.isEmpty(), 'undefined is empty');
    assert.ok(_.isEmpty(''), 'the empty string is empty');
    assert.notOk(_.isEmpty('moe'), 'but other strings are not');

    var obj = { one: 1 };
    delete obj.one;
    assert.ok(_.isEmpty(obj), 'deleting all the keys from an object empties it');

    var args = function () { return arguments; };
    assert.ok(_.isEmpty(args()), 'empty arguments object is empty');
    assert.notOk(_.isEmpty(args('')), 'non-empty arguments object is not empty');

    // covers collecting non-enumerable properties in IE < 9
    var nonEnumProp = { toString: 5 };
    assert.notOk(_.isEmpty(nonEnumProp), 'non-enumerable property is not empty');
  })

  if (typeof document === 'object') {
    QUnit.test('isElement', function (assert) {
      assert.notOk(_.isElement('div'), 'strings are not dom elements');
      assert.ok(_.isElement(testElement), 'an element is a DOM element');
    });
  }

  QUnit.test('isArray', function (assert) {
    assert.notOk(_.isArray(void 0), 'undefined不是数组')
    assert.notOk(_.isArray(arguments), 'arguments不是数组')
    assert.ok(_.isArray([1, 2, 3]), '可以检测数组')
  })

  QUnit.test('isObject', function (assert) {
    assert.ok(_.isObject(arguments), 'arguments是object')
    assert.ok(_.isObject([1, 2, 3]), '数组是object')
    if (testElement) {
      assert.ok(_.isObject(testElement), 'DOM元素是对象')
    }
    assert.ok(_.isObject(_.noop), '函数是对象')
    assert.notOk(_.isObject(null), 'null不是对象')
    assert.notOk(_.isObject(void 0), 'undefined不是对象')
    assert.notOk(_.isObject('string'), 'string不是对象')
    assert.notOk(_.isObject(12), 'number不是对象')
    assert.notOk(_.isObject(true), 'true不是对象')
    // new新建实例对象，因此是一个对象
    assert.ok(_.isObject(new String()), 'new String()是对象')
  })

  QUnit.test('isFunction', function (assert) {
    assert.notOk(_.isFunction(void 0), 'undefined不是函数')
    assert.notOk(_.isFunction([1, 2, 3]), '数组不是函数')
    assert.notOk(_.isFunction('moe'), '字符串不是函数')
    assert.ok(_.isFunction(_.isFunction), '函数是函数')
    assert.ok(_.isFunction(function () { }), '匿名函数是函数')

    testElement && assert.notOk(_.isFunction(testElement), '元素不是函数')

    var nodeList = typeof document !== 'undefined' && document.childNodes
    nodeList && assert.notOk(_.isFunction(nodeList))
  })

  QUnit.test('isFinite', function (assert) {
    assert.notOk(_.isFinite(void 0), 'undefined is not finite');
    assert.notOk(_.isFinite(null), 'null is not finite');
    assert.notOk(_.isFinite(NaN), 'NaN is not finite');
    assert.notOk(_.isFinite(Infinity), 'Infinity is not finite');
    assert.notOk(_.isFinite(-Infinity), '-Infinity is not finite');
    assert.ok(_.isFinite('12'), 'Numeric strings are numbers');
    assert.notOk(_.isFinite('1a'), 'Non numeric strings are not numbers');
    assert.notOk(_.isFinite(''), 'Empty strings are not numbers');
    var obj = new Number(5);
    assert.ok(_.isFinite(obj), 'Number instances can be finite');
    assert.ok(_.isFinite(0), '0 is finite');
    assert.ok(_.isFinite(123), 'Ints are finite');
    assert.ok(_.isFinite(-12.44), 'Floats are finite');
    if (typeof Symbol === 'function') {
      assert.notOk(_.isFinite(Symbol()), 'symbols are not numbers');
      assert.notOk(_.isFinite(Symbol('description')), 'described symbols are not numbers');
      assert.notOk(_.isFinite(Object(Symbol())), 'boxed symbols are not numbers');
    }
  });

  QUnit.test('isBoolean', function (assert) {
    assert.notOk(_.isBoolean(2), '数字不是布尔值');
    assert.notOk(_.isBoolean('string'), '字符串不是布尔值');
    assert.notOk(_.isBoolean('false'), '字符串“false”不是布尔值');
    assert.notOk(_.isBoolean('true'), '字符串“true”不是布尔值');
    assert.notOk(_.isBoolean(arguments), 'arguments不是布尔值');
    assert.notOk(_.isBoolean(void 0), 'undefined不是布尔值');
    assert.notOk(_.isBoolean(NaN), 'NaN不是布尔值');
    assert.notOk(_.isBoolean(null), 'null不是布尔值');
    assert.ok(_.isBoolean(true), 'true是布尔值');
    assert.ok(_.isBoolean(false), 'false是布尔值');
  });

  QUnit.test('isNull', function (assert) {
    assert.notOk(_.isNull(void 0), 'undefined is not null');
    assert.notOk(_.isNull(NaN), 'NaN is not null');
    assert.ok(_.isNull(null), 'but null is');
  });

  QUnit.test('isUndefined', function (assert) {
    assert.notOk(_.isUndefined(1), 'numbers are defined');
    assert.notOk(_.isUndefined(null), 'null is defined');
    assert.notOk(_.isUndefined(false), 'false is defined');
    assert.notOk(_.isUndefined(NaN), 'NaN is defined');
    assert.ok(_.isUndefined(), 'nothing is undefined');
    assert.ok(_.isUndefined(void 0), 'undefined is undefined');
  });
})()