; (function () {
  QUnit.test('each', function (assert) {
    var list = [1, 2, 3]
    _.each(list, function (num, i) {
      assert.strictEqual(num, i + 1, '每个回调函数提供了value和index')
    })

    var ans = []
    _.each(list, function (num) {
      ans.push(num * this.multiplier)
    }, { multiplier: 5 })
    assert.deepEqual(ans, [5, 10, 15], '执行上下文')

    ans = []
    _.each(list, function (num) {
      ans.push(num)
    })
    assert.deepEqual(ans, list, '可以简单地迭代一个数组')

    ans = []
    var obj = { one: 1, two: 2, three: 3 }
    obj.constructor.prototype.four = 4
    _.each(obj, function (val, key) {
      ans.push(key)
    })
    assert.deepEqual(ans, ['one', 'two', 'three'], '迭代奏效，并无视了原型链上的属性')
    delete obj.constructor.prototype.four

    var count = 0
    obj = { 1: 'foo', 2: 'bar', 3: 'baz' }
    _.each(obj, function () {
      count++
    })
    assert.strictEqual(count, 3, '这个函数应该被执行三次')

    ans = null
    _.each(list, function (num, i, arr) {
      if (_.include(arr, num)) {
        ans = true
      }
    })
    assert.ok(ans, '可以从迭代器中取得值')

    ans = 0
    _.each(null, function () {
      ++ans
    })
    assert.strictEqual(ans, 0, '传入null值')

    _.each(false, _.noop)

    assert.strictEqual(_.each(list, _.noop), list, '返回处理后的对象')
    assert.strictEqual(_.each(null, _.noop), null)
  })

  QUnit.test('map', function (assert) {
    assert.deepEqual(_.map([1, 2, 3], function (num) {
      return num * 2
    }), [2, 4, 6])

    assert.deepEqual(_.map([1, 2, 3], function (num) {
      return num * this.multiplier
    }, { multiplier: 3 }), [3, 6, 9])

    assert.deepEqual(_([1, 2, 3]).map(function (num) {
      return num * 2
    }), [2, 4, 6], '面向对象模式')

    assert.deepEqual(_.map({ length: 2, 0: { id: 1 }, 1: { id: 2 } }, function (item) {
      return item.id
    }), [1, 2], '可以用于array-like对象')

    assert.deepEqual(_.map(null, _.noop), [], '可以处理空的情况')
    assert.deepEqual(_.map([1], function (item) {
      return this.length
    }, [1, 2]), [2], '有执行上下文的情况')

    // 依赖于cb函数的自动处理。如果传入字符串，则自动将该字符串当做属性名处理，返回一个传入obj return obj的该属性值的函数
    assert.deepEqual(_.map([{ name: 'moe', age: 30 }, { name: 'curly', age: 50 }], 'name'), ['moe', 'curly'], '传入字符串，则自动取该字符串对应的属性名')
  })

  QUnit.test('reduce', function (assert) {
    var arr = [1, 2, 3]
    assert.strictEqual(_.reduce(arr, function (memo, num) {
      return memo + num
    }, 0), 6, '可以将一个数组加在一起')

    var context = { multiplier: 3 }
    assert.strictEqual(_.reduce(arr, function (memo, num) {
      return memo + num * this.multiplier
    }, 0, context), 18, '执行上下文')

    assert.strictEqual(_([1, 2, 3]).reduce(function (memo, num) {
      return memo + num
    }, 0), 6, '面向对象模式')

    assert.strictEqual(_.reduce(arr, function (memo, num) {
      return memo + num
    }), 6, '默认初始值')

    assert.strictEqual(_.reduce([1, 2, 3, 4], function (memo, num) {
      return memo * num
    }), 24, '可以乘法归纳')

    assert.strictEqual(_.reduce(null, _.noop, 138), 138, '可以接受有初始值的null')
    assert.strictEqual(_.reduce([], _.noop, void 0), void 0, 'undefined可以作为特殊用例通过')
    assert.strictEqual(_.reduce([_], _.noop), _, '集合长度为1，没有初始值，返回第一个值')
    assert.strictEqual(_.reduce([], _.noop), void 0, '集合为空，没有初始值，返回undefined')
  })

  QUnit.test('foldl', function (assert) {
    assert.strictEqual(_.foldl, _.reduce, '是reduce的别名')
  })

  QUnit.test('inject', function (assert) {
    assert.strictEqual(_.inject, _.reduce, '是reduce的别名')
  })

  QUnit.test('reduceRight', function (assert) {
    var list = ['foo', 'bar', 'baz']
    assert.strictEqual(_.reduceRight(list, function (memo, str) {
      return memo + str
    }, ''), 'bazbarfoo', '可以从右折叠')
    assert.strictEqual(_.reduceRight(list, function (memo, str) {
      return memo + str
    }), 'bazbarfoo', '默认初始值')

    assert.strictEqual(_.reduceRight({ a: 1, b: 2, c: 3 }, function (memo, num) {
      return memo + num
    }), 6, '传入对象，默认初始值')

    assert.strictEqual(_.reduce(null, _.noop, 138), 138, '可以接受有初始值的null')
    assert.strictEqual(_.reduce([], _.noop, void 0), void 0, 'undefined可以作为特殊用例通过')
    assert.strictEqual(_.reduce([_], _.noop), _, '集合长度为1，没有初始值，返回第一个值')
    assert.strictEqual(_.reduce([], _.noop), void 0, '集合为空，没有初始值，返回undefined')

    var args,
      init = {},
      obj = { a: 1, b: 2 },
      lastKey = _.keys(obj).pop()
    var expected = lastKey === 'a' ? [init, 1, 'a', obj] : [init, 2, 'b', obj]
    _.reduceRight(obj, function () {
      if (!args) {
        args = _.toArray(arguments)
      }
    }, init)
    assert.deepEqual(args, expected)

    obj = { 2: 'a', 1: 'b' }
    lastKey = _.keys(obj).pop()
    args = null
    expected = lastKey === '2' ? [init, 'a', '2', obj] : [init, 'b', '1', obj]
    _.reduceRight(obj, function () {
      if (!args) {
        args = _.toArray(arguments)
      }
    }, init)
    assert.deepEqual(args, expected)
  })

  QUnit.test('foldr', function (assert) {
    assert.strictEqual(_.foldr, _.reduceRight, '是reduceRight的别名')
  })

  QUnit.test('find', function (assert) {
    var arr = [1, 2, 3, 4]
    assert.strictEqual(_.find(arr, function (n) {
      return n > 2
    }), 3, '应该返回第一个找到的value')
    assert.strictEqual(_.find(arr, function () {
      return false
    }), void 0, '如果没有找到value，应该返回undefined')

    arr.dontmatch = 55
    assert.strictEqual(_.find(arr, function (n) {
      return n === 55
    }), void 0, '对array-like有效')

    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }, { a: 2, b: 4 }]
    assert.deepEqual(_.find(list, { a: 1 }), { a: 1, b: 2 }, '可以被用作findWhere')
    assert.deepEqual(_.find(list, { b: 4 }), { a: 1, b: 4 })
    assert.strictEqual(_.find(list, { c: 1 }), void 0, '在没找到时返回undefined')
    assert.strictEqual(_.find([], { c: 1 }), void 0, '在检索空列表时为undefined')

    assert.strictEqual(_.find([1, 2, 3], function (n) {
      return n * 2 === 4
    }), 2, '找到2并停止循环')

    var obj = {
      a: { x: 1, z: 3 },
      b: { x: 2, z: 2 },
      c: { x: 3, z: 4 },
      d: { x: 4, z: 1 }
    }
    assert.deepEqual(_.find(obj, { x: 2 }), { x: 2, z: 2 }, '对对象生效')
    assert.deepEqual(_.find(obj, { x: 2, z: 1 }), void 0)
    assert.deepEqual(_.find(obj, function (x) {
      return x.x === 4
    }), { x: 4, z: 1 })

    _.find([{ a: 1 }], function (val, key, obj) {
      assert.strictEqual(key, 0)
      assert.deepEqual(val, { a: 1 })
      assert.strictEqual(this, _, '执行上下文')
    }, _)
  })

  QUnit.test('detect', function (assert) {
    assert.strictEqual(_.detect, _.find, '是find的别名')
  })

  QUnit.test('filter', function (assert) {
    var arr = [1, 2, 3, 4, 5, 6],
      obj = { one: 1, two: 2, three: 3 },
      isEven = function (num) {
        return num % 2 === 0
      }
    assert.deepEqual(_.filter(arr, isEven), [2, 4, 6])
    assert.deepEqual(_.filter(obj, isEven), [2], '能够过滤对象')
    assert.deepEqual(_.filter([{}, obj, []], 'two'), [obj], '断言字符串，连接至object的属性')
    _.filter([1], function () {
      assert.strictEqual(this, obj, '执行上下文')
    }, obj)

    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
    assert.deepEqual(_.filter(list, { a: 1 }), [{ a: 1, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }])
    assert.deepEqual(_.filter(list, { b: 2 }), [{ a: 1, b: 2 }, { a: 2, b: 2 }])
    assert.deepEqual(_.filter(list, {}), list, '空对象返回所有值')
    assert.deepEqual(_(list).filter({}), list, '面向对象模式')
  })

  QUnit.test('where', function (assert) {
    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }],
      result = _.where(list, { a: 1 })
    assert.strictEqual(result.length, 3)
    assert.strictEqual(result[result.length - 1].b, 4)

    result = _.where(list, { b: 2 })
    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[0].a, 1)

    result = _.where(list, {})
    assert.strictEqual(result.length, list.length)

    function test() { }
    test.map = _.map
    assert.deepEqual(_.where([_, { a: 1, b: 2 }, _], test), [_, _], '函数的属性也会被检查')
  })

  QUnit.test('findWhere', function (assert) {
    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
    assert.deepEqual(_.findWhere(list, { a: 1 }), { a: 1, b: 2 })
    assert.deepEqual(_.findWhere(list, { b: 4 }), { a: 1, b: 4 })
    assert.strictEqual(_.findWhere(list, { c: 1 }), void 0, '查找不到结果时返回undefined')
    assert.strictEqual(_.findWhere([], { a: 1 }), void 0, '列表为空时返回undefined')

    function test() { }
    test.map = _.map
    assert.strictEqual(_.findWhere([_, { a: 1, b: 2 }, _], test), _, '函数的属性也会被检查')

    function TestClass() {
      this.y = 5
      this.x = 'foo'
    }
    var expected = { c: 1, x: 'foo', y: 5 }
    assert.strictEqual(_.findWhere([{ y: 5, b: 6 }, expected], new TestClass()), expected, '使用实例的属性')
  })

  QUnit.test('reject', function (assert) {
    var numbers = [1, 2, 3, 4, 5, 6]
    var odds = _.reject(numbers, function (n) {
      return !(n & 1)
    })
    assert.deepEqual(odds, [1, 3, 5], '拒绝每个偶数')

    var context = 'obj'
    var evens = _.reject(numbers, function (n) {
      assert.strictEqual(context, 'obj')
      return n & 1
    }, context)
    assert.deepEqual(evens, [2, 4, 6], '拒绝每个奇数')

    assert.deepEqual(_.reject([odds, { one: 1, two: 2, three: 3 }], 'two'), [odds], '断言字符类型')

    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
    assert.deepEqual(_.reject(list, { a: 1 }), [{ a: 2, b: 2 }])
    assert.deepEqual(_.reject(list, { b: 2 }), [{ a: 1, b: 3 }, { a: 1, b: 4 }])
    assert.deepEqual(_.reject(list, {}), [], '当给予空对象，返回空列表')
  })

  QUnit.test('every', function (assert) {
    assert.ok(_.every([], _.identify), true, '空集合返回true')
    assert.ok(_.every([true, true, true], _.identify), true, '每项都为true')
    assert.notOk(_.every([true, false, true], _.identify), false, '一项为false')
    assert.ok(_.every([0, 10, 28], function (num) {
      return num % 2 === 0
    }), true, '偶数')
    assert.notOk(_.every([0, 11, 28], function (num) {
      return num % 2 === 0
    }), false, '一个奇数')
    assert.strictEqual(_.every([1], _.identify), true)
    assert.strictEqual(_.every([0], _.identify), false)
    assert.notOk(_.every([void 0, void 0, void 0], _.identify), '对undefined适用')

    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
    assert.notOk(_.every(list, { a: 1, b: 2 }), '可以传入对象')
    assert.ok(_.every(list, 'a'), '可以传入字符串')

    list = [{ a: 1, b: 2 }, { a: 2, b: 2, c: true }]
    assert.ok(_.every(list, { b: 2 }), '可以传入对象')
    assert.notOk(_.every(list, 'c'), 'string被作为对象的属性名')

    assert.ok(_.every({ a: 1, b: 2, c: 3, d: 4 }, _.isNumber), '接受object')
    assert.notOk(_.every({ a: 1, b: 2, c: 3, d: 4 }, _.isObject), '接受object')
    assert.ok(_.every(['a', 'b', 'c', 'd'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
    assert.notOk(_.every(['a', 'b', 'c', 'd', 'e'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
  })

  QUnit.test('all', function (assert) {
    assert.strictEqual(_.all, _.every, '是every的别名')
  })

  QUnit.test('some', function (assert) {
    assert.notOk(_.some([]), '空集合')
    assert.notOk(_.some([false, false, false]), '全部是false')
    assert.ok(_.some([false, false, true]), '一个true')
    assert.ok(_.some([null, 0, 'yes', false]), '一个字符串')
    assert.notOk(_.some([null, 0, '', false]), 'falsy值')
    assert.notOk(_.some([1, 11, 29], function (num) {
      return !(num & 1)
    }), '全部是奇数')
    assert.ok(_.some([1, 10, 29], function (num) {
      return !(num & 1)
    }), '有一个偶数')
    assert.strictEqual(_.some([1], _.identify), true)
    assert.strictEqual(_.some([0], _.identify), false)
    assert.ok([false, false, true])

    var list = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1, b: 3 }, { a: 1, b: 4 }]
    assert.notOk(_.some(list, { a: 5, b: 2 }), 'can be called width obj')
    assert.ok(_.some(list, 'a'), '字符串mapped to对象属性')

    list = [{ a: 1, b: 2 }, { a: 2, b: 2, c: true }]
    assert.ok(_.some(list, { b: 2 }), 'can be called width obj')
    assert.notOk(_.some(list, 'd'), '字符串mapped to对象属性')

    assert.ok(_.some({ a: '1', b: '2', c: '3', d: '4', e: 6 }, _.isNumber), '接受对象')
    assert.notOk(_.some({ a: 1, b: 2, c: 3, d: 4 }, _.isObject))
    assert.ok(_.some(['a', 'b', 'c', 'd'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
    assert.notOk(_.some(['x', 'y', 'z'], _.hasOwnProperty, { a: 1, b: 2, c: 3, d: 4 }), '执行上下文')
  })

  QUnit.test('any', function (assert) {
    assert.strictEqual(_.any, _.some, '是some的别名')
  })

  QUnit.test('includes', function (assert) {
    _.each([null, void 0, 0, 1, NaN, {}, []], function (val) {
      assert.strictEqual(_.includes(val, 'hasOwnProperty'), false)
    })
    assert.strictEqual(_.includes([1, 2, 3], 2), true, '2在数组中')
    assert.strictEqual(_.includes([1, 3, 9], 2), false, '2不在数组中')
    assert.strictEqual(_.includes([5, 4, 3, 2, 1], 5, true), false, '使用二分法查找，要求数组正序')
    assert.strictEqual(_.includes({ moe: 1, larry: 3, curly: 9 }, 3), true, '如果是object，只检查值')
    assert.ok(_([1, 2, 3]).includes(2), '面向对象模式')

    var numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3]
    assert.strictEqual(_.includes(numbers, 1, 1), true, 'fromIndex')
    assert.strictEqual(_.includes(numbers, 1, -1), false, 'fromIndex')
    assert.strictEqual(_.includes(numbers, 1, -2), false, 'fromIndex')
    assert.strictEqual(_.includes(numbers, 1, -3), true, 'fromIndex')
    assert.strictEqual(_.includes(numbers, 1, 6), true, 'fromIndex')
    assert.strictEqual(_.includes(numbers, 1, 7), false, 'fromIndex')

    // 不懂这个测试用例的意义，也不知道guard的意义，文档也没有提到这个参数的意义，因此没有在代码中写入guard参数
    assert.ok(_.every([1, 2, 3], _.partial(_.includes, numbers)), 'fromIndex is guarded')
  })

  QUnit.test('include', function (assert) {
    assert.strictEqual(_.include, _.includes, '是includes的别名')
  })

  QUnit.test('contains', function (assert) {
    assert.strictEqual(_.contains, _.includes, '是includes的别名')
  })

  QUnit.test('invoke', function (assert) {
    var list = [[5, 1, 7], [3, 2, 1]]
    var result = _.invoke(list, 'sort')
    assert.deepEqual(result[0], [1, 5, 7], '第一个数组被排序了')
    assert.deepEqual(result[1], [1, 2, 3], '第二个数组被排序了')

    _.invoke([{
      method: function () {
        assert.deepEqual(_.toArray(arguments), [1, 2, 3], 'called width arguments')
      }
    }], 'method', 1, 2, 3)

    assert.deepEqual(_.invoke([{ a: null }, {}, { a: _.constant(1) }], 'a'), [null, void 0, 1], '支持null和undefined')

    assert.raises(function () {
      _.invoke([{ a: 1 }], 'a')
    }, TypeError, '不是函数抛出错误')

    var getFoo = _.constant('foo'),
      getThis = function () {
        return this
      },
      item = {
        a: {
          b: getFoo,
          c: getThis,
          d: null
        },
        e: getFoo,
        f: getThis,
        g: function () {
          return {
            h: getFoo
          }
        }
      },
      arr = [item]
    assert.deepEqual(_.invoke(arr, ['a', 'b']), ['foo'], '支持通过数组语法使用deep method')
    assert.deepEqual(_.invoke(arr, ['a', 'c']), [item.a], '在他们的直接父节点上执行deep method')
    assert.deepEqual(_.invoke(arr, ['a', 'd', 'z']), [void 0], '不试图使用非数组的属性')
    assert.deepEqual(_.invoke(arr, ['a', 'd']), [null], '支持deep null值')
    assert.deepEqual(_.invoke(arr, ['e']), ['foo'], '支持长度为一的path数组')
    assert.deepEqual(_.invoke(arr, ['f']), [item], '正确使用父执行上下文')
    assert.deepEqual(_.invoke(arr, ['g', 'h']), [void 0], '不会执行中间的函数')

    arr = [{
      a: function () {
        return 'foo'
      }
    }, {
      a: function () {
        return 'bar'
      }
    }]
    assert.deepEqual(_.invoke(arr, 'a'), ['foo', 'bar'], '可以支持在后来的对象上的不同方法')

    // 调用函数引用
    result = _.invoke(list, Array.prototype.sort)
    assert.deepEqual(result[0], [1, 5, 7], '第一个数组被排序')
    assert.deepEqual(result[1], [1, 2, 3], '第二个数组被排序')

    assert.deepEqual(_.invoke([1, 2, 3], function (a) {
      return a + this
    }, 5), [6, 7, 8], '从invoke获得参数')

    // 当string有一个call函数时
    String.prototype.call = function () {
      return 42
    }
    var s = 'foo'
    assert.strictEqual(s.call(), 42, '函数call存在')
    result = _.invoke(list, 'sort')
    assert.deepEqual(result[0], [1, 5, 7], '第一个数组被排序')
    assert.deepEqual(result[1], [1, 2, 3], '第二个数组被排序')
    delete String.prototype.call
    assert.strictEqual(s.call, void 0, '函数call被移除')
  })

  QUnit.test('pluck', function (assert) {
    var people = [{ name: 'moe', age: 30 }, { name: 'curly', age: 50 }]
    assert.deepEqual(_.pluck(people, 'name'), ['moe', 'curly'], '从对象中萃取name')
    assert.deepEqual(_.pluck(people, 'address'), [void 0, void 0], '不存在的对象则返回undefined')
    // 兼容：最灵活支持边界用例
    assert.deepEqual(_.pluck([{ '[object Object]': 1 }], {}), [1])
  })

  QUnit.test('max', function (assert) {
    assert.strictEqual(-Infinity, _.max(null), '支持null')
    assert.strictEqual(-Infinity, _.max(void 0), '支持undefined')
    assert.strictEqual(-Infinity, _.max(null, _.identify), '支持null/undefined')
    assert.strictEqual(_.max([1, 2, 3]), 3, '可以表现为普通的Math.max')
    assert.strictEqual(_.max([1, 2, 3], function (num) {
      return -num
    }), 1)
    assert.strictEqual(-Infinity, _.max({}), '空对象')
    assert.strictEqual(-Infinity, _.max([]), '空数组')
    assert.strictEqual(_.max({ a: 'a' }), -Infinity, '不是数字集合的最大值')
    assert.strictEqual(_.max(_.range(1, 300000)), 299999, '超大数组的最大值')
    assert.strictEqual(_.max([1, 2, 3, 'test']), 3, '以数字开头包含NaN的数组')
    assert.strictEqual(_.max(['test', 1, 2, 3]), 3, '以NaN开头的数组')
    assert.strictEqual(_.max([1, 2, 3, null]), 3, '以数字开头包含null的数组')
    assert.strictEqual(_.max([null, 1, 2, 3]), 3, '以null开头的数组')
    assert.strictEqual(_.max([1, 2, 3, '']), 3, '以数字开头包含空字符串的数组')
    assert.strictEqual(_.max(['', 1, 2, 3]), 3, '以空字符串开头的数组')
    assert.strictEqual(_.max([1, 2, 3, false]), 3, '以数字开头包含false的数组')
    assert.strictEqual(_.max([false, 1, 2, 3]), 3, '以false开头的数组')
    assert.strictEqual(_.max([0, 1, 2, 3, 4]), 4, '包含0的数组')
    assert.strictEqual(_.max([-3, -2, -1, 0]), 0, '包含负数的数组')
    assert.deepEqual(_.map([[1, 2, 3], [4, 5, 6]], _.max), [3, 6])

    var a = { x: -Infinity },
      b = { x: -Infinity },
      iterator = function (obj) {
        return obj.x
      }
    assert.strictEqual(_.max([a, b], iterator), a)

    assert.deepEqual(_.max([{ a: 1 }, { a: 0, b: 3 }, { a: 4 }, { a: 2 }], 'a'), { a: 4 }, '字符串作为iterator')
    assert.deepEqual(_.max([0, 2], function (c) {
      return c * this.x
    }, { x: 1 }), 2, '执行上下文')
    // iterator为0，走的是_.property，相当于对比第0个元素的大小（属性值为0）
    assert.deepEqual(_.max([[1], [2, 3], [-1, 4], [5]], 0), [5], '注意易错的iterator')
    assert.deepEqual(_.max([{ 0: 1 }, { 0: 2 }, { 0: -1 }, { a: 1 }], 0), { 0: 2 }, '注意易错的iterator')
  })

  QUnit.test('min', function (assert) {
    assert.strictEqual(_.min(null), Infinity, '支持null和undefined')
    assert.strictEqual(_.min(void 0), Infinity, '支持null和undefined')
    assert.strictEqual(_.min(null, _.identify), Infinity, '支持null和undefined')
    assert.strictEqual(_.min([1, 2, 3]), 1, '可以表现为普通的Math.min')
    assert.strictEqual(_.min([1, 2, 3], function (num) {
      return -num
    }), 3)
    assert.strictEqual(Infinity, _.min({}), '空对象')
    assert.strictEqual(Infinity, _.min([]), '空数组')
    assert.strictEqual(_.min({ a: 'a' }), Infinity, '不是数字集合的最小值')
    assert.deepEqual(_.map([[1, 2, 3], [4, 5, 6]], _.min), [1, 4])
    assert.strictEqual(_.min([1, 2, 3, 'test']), 1, '以数字开头包含NaN的数组')
    assert.strictEqual(_.min(['test', 1, 2, 3]), 1, '以NaN开头的数组')
    assert.strictEqual(_.min([1, 2, 3, null]), 1, '以数字开头包含null的数组')
    assert.strictEqual(_.min([null, 1, 2, 3]), 1, '以null开头的数组')
    assert.strictEqual(_.min([0, 1, 2, 3, 4]), 0, '包含0的数组')
    assert.strictEqual(_.min([-3, -2, -1, 0]), -3, '包含负数的数组')
    assert.strictEqual(_.min(_.range(1, 300000)), 1, '超大数组的最小值')

    var now = new Date(9999999999)
    var then = new Date(0)
    assert.strictEqual(_.min([now, then]), then)

    var a = { x: Infinity },
      b = { x: Infinity },
      iterator = function (obj) {
        return obj.x
      }
    assert.strictEqual(_.min([a, b], iterator), a)
    assert.deepEqual(_.min([{ a: 1 }, { a: 0, b: 3 }, { a: 4 }, { a: 2 }], 'a'), { a: 0, b: 3 }, '字符串作为iterator')
    assert.deepEqual(_.min([0, 2], function (c) {
      return c * this.x
    }, { x: 1 }), 0, '执行上下文')
    // iterator为0，走的是_.property，相当于对比第0个元素的大小（属性值为0）
    assert.deepEqual(_.min([[1], [2, 3], [-1, 4], [5]], 0), [-1, 4], '注意易错的iterator')
    assert.deepEqual(_.min([{ 0: 1 }, { 0: 2 }, { 0: -1 }, { a: 1 }], 0), { 0: -1 }, '注意易错的iterator')
  })

  QUnit.test('sortBy', function (assert) {
    var people = [{ name: 'curly', age: 50 }, { name: 'moe', age: 30 }]
    people = _.sortBy(people, function (person) {
      return person.age
    })
    assert.deepEqual(_.pluck(people, 'name'), ['moe', 'curly'], '按年龄排序')

    var list = [void 0, 4, 1, void 0, 3, 2]
    assert.deepEqual(_.sortBy(list, _.identify), [1, 2, 3, 4, void 0, void 0], '排序undefined')

    list = ['one', 'two', 'three', 'four', 'five']
    assert.deepEqual(_.sortBy(list, 'length'), ['one', 'two', 'four', 'five', 'three'], '依据长度排序')

    function Pair(x, y) {
      this.x = x
      this.y = y
    }
    var stableArray = [new Pair(1, 1), new Pair(1, 2), new Pair(1, 3), new Pair(1, 4), new Pair(1, 5), new Pair(1, 6),
    new Pair(2, 1), new Pair(2, 2), new Pair(2, 3), new Pair(2, 4), new Pair(2, 5), new Pair(2, 6),
    new Pair(3, 1), new Pair(3, 2), new Pair(3, 3), new Pair(3, 4), new Pair(3, 5), new Pair(3, 6)]
    assert.deepEqual(_.sortBy(stableArray, function (pair) {
      return pair.x
    }), stableArray, 'sortBy对数组稳定')
    assert.deepEqual(_.sortBy(stableArray, 'x'), stableArray, 'sortBy接受属性字符串')

    list = ['q', 'w', 'e', 'r', 't', 'y']
    assert.deepEqual(_.sortBy(list), ['e', 'q', 'r', 't', 'w', 'y'], '如果没有规定，_.iterator使用_.identity')
  })

  QUnit.test('groupBy', function (assert) {
    var parity = _.groupBy([1, 2, 3, 4, 5, 6], function (num) {
      return num % 2
    })
    assert.ok('0' in parity && '1' in parity, '为每个value创建组')
    assert.deepEqual(parity[0], [2, 4, 6], '把偶数放在了正确的组里')

    var list = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
      grouped = _.groupBy(list, 'length')
    assert.deepEqual(grouped['3'], ['one', 'two', 'six', 'ten'])
    assert.deepEqual(grouped['4'], ['four', 'five', 'nine'])
    assert.deepEqual(grouped['5'], ['three', 'seven', 'eight'])

    var context = {}
    _.groupBy([{}], function () {
      assert.strictEqual(this, context)
    }, context)

    grouped = _.groupBy([4.2, 6.1, 6.4], function (num) {
      return Math.floor(num) > 4 ? 'hasOwnProperty' : 'constructor'
    })
    assert.strictEqual(grouped.constructor.length, 1)
    assert.strictEqual(grouped.hasOwnProperty.length, 2)

    var array = [{}]
    _.groupBy(array, function (val, index, obj) {
      assert.strictEqual(obj, array)
    })

    array = [1, 2, 1, 2, 3]
    grouped = _.groupBy(array)
    assert.strictEqual(grouped['1'].length, 2)
    assert.strictEqual(grouped['3'].length, 1)

    var matrix = [[1, 2], [1, 3], [2, 3]]
    assert.deepEqual(_.groupBy(matrix, 0), { 1: [[1, 2], [1, 3]], 2: [[2, 3]] })
    assert.deepEqual(_.groupBy(matrix, 1), { 2: [[1, 2]], 3: [[1, 3], [2, 3]] })

    var liz = { name: 'Liz', status: { power: 10 } },
      chelsea = { name: 'Chelsea', status: { power: 10 } },
      jordan = { name: 'Jordan', status: { power: 6 } },
      collection = [liz, chelsea, jordan]
    assert.deepEqual(_.groupBy(collection, ['status', 'power']), { 10: [liz, chelsea], 6: [jordan] }, '可以用深属性分组')
  })

  QUnit.test('indexBy', function (assert) {
    var parity = _.indexBy([1, 2, 3, 4, 5], function (num) { return num % 2 === 0 })
    assert.strictEqual(parity['true'], 4)
    assert.strictEqual(parity['false'], 5)

    var list = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    var grouped = _.indexBy(list, 'length')
    assert.strictEqual(grouped['3'], 'ten')
    assert.strictEqual(grouped['4'], 'nine')
    assert.strictEqual(grouped['5'], 'eight')

    var array = [1, 2, 1, 2, 3]
    grouped = _.indexBy(array)
    assert.strictEqual(grouped['1'], 1)
    assert.strictEqual(grouped['2'], 2)
    assert.strictEqual(grouped['3'], 3)
  })

  QUnit.test('countBy', function (assert) {
    var parity = _.countBy([1, 2, 3, 4, 5], function (num) { return num % 2 === 0 })
    assert.strictEqual(parity['true'], 2)
    assert.strictEqual(parity['false'], 3)

    var list = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    var grouped = _.countBy(list, 'length')
    assert.strictEqual(grouped['3'], 4)
    assert.strictEqual(grouped['4'], 3)
    assert.strictEqual(grouped['5'], 3)

    var context = {}
    _.countBy([{}], function () { assert.strictEqual(this, context) }, context)

    grouped = _.countBy([4.2, 6.1, 6.4], function (num) {
      return Math.floor(num) > 4 ? 'hasOwnProperty' : 'constructor'
    })
    assert.strictEqual(grouped.constructor, 1)
    assert.strictEqual(grouped.hasOwnProperty, 2)

    var array = [{}]
    _.countBy(array, function (value, index, obj) { assert.strictEqual(obj, array) })

    array = [1, 2, 1, 2, 3]
    grouped = _.countBy(array)
    assert.strictEqual(grouped['1'], 2)
    assert.strictEqual(grouped['3'], 1)
  })

  QUnit.test('shuffle', function (assert) {
    assert.deepEqual(_.shuffle([1]), [1], '长度为一的数组，表现正确')
    var numbers = _.range(20)
    var shuffled = _.sample(numbers, 20)
    assert.notDeepEqual(numbers, shuffled, '改变了顺序')
    assert.notStrictEqual(numbers, shuffled, '引用地址也不同')
    assert.deepEqual(_.sortBy(shuffled), numbers, '在乱序前后包含相同的成员')

    shuffled = _.shuffle({ a: 1, b: 2, c: 3, d: 4 })
    assert.strictEqual(shuffled.length, 4)
    assert.deepEqual(shuffled.sort(), [1, 2, 3, 4], '对object生效')
  })

  QUnit.test('sample', function (assert) {
    assert.strictEqual(_.sample([1]), 1, '没有传第二个参数，表现正确')
    assert.deepEqual(_.sample([1, 2, 3], -2), [], '负数n，表现正确')
    var numbers = _.range(10)
    assert.deepEqual(_.sample(numbers, 10).sort(), numbers, '在取样前后包含相同的成员')
    assert.deepEqual(_.sample(numbers, 20).sort(), numbers, '当取样比原数组的值多时也正常工作')
    assert.ok(_.contains(numbers, _.sample(numbers)), '取样包括在原数组中')
    assert.strictEqual(_.sample([]), void 0, '从空数组取样返回undefined')
    assert.notStrictEqual(_.sample([], 5), [], '空数组，传n，返回空数组')
    assert.notStrictEqual(_.sample([1, 2, 3], 0), [], 'n传0返回空数组')
    assert.ok(_.contains([1, 2, 3], _.sample({ a: 1, b: 2, c: 3 })), '从一个对象取出一个样本')
    assert.notDeepEqual(_.sample(_.range(1000).sort(), 10), _.range(10), '从整个数组取样，而不是从开头')
  })

  QUnit.test('toArray', function (assert) {
    assert.notOk(_.isArray(arguments), 'arguments不是数组')
    assert.ok(_.isArray(_.toArray()), '将arguments转换为数组')

    var a = [1, 2, 3]
    assert.notStrictEqual(_.toArray(a), a, 'a是被克隆的')
    assert.deepEqual(_.toArray(a), [1, 2, 3], '被克隆的数组包含相同的元素')

    var numbers = _.toArray({ one: 1, two: 2, three: 3 })
    assert.deepEqual(numbers, [1, 2, 3], '对象被变成数组')

    var hearts = '\uD83D\uDC95',
      pair = hearts.split(''),
      expected = [pair[0], hearts, '&', hearts, pair[1]]
    assert.deepEqual(_.toArray(expected.join('')), expected, '对特殊字符有用')
    assert.deepEqual(_.toArray(''), [], '空字符串被转换为空数组')

    if (typeof document !== 'undefined') {
      var actual
      try {
        actual = _.toArray(document.childNodes)
      } catch (error) {
        // ignored
      }
      assert.deepEqual(actual, _.map(document.childNodes, _.identify), '对NodeList有用')
    }
  })

  QUnit.test('size', function (assert) {
    assert.strictEqual(_.size({ one: 1, two: 2, three: 3 }), 3, '可以计算对象的长度')
    assert.strictEqual(_.size([1, 2, 3]), 3, '可以计算数组的长度')
    assert.strictEqual(_.size({ length: 3, 0: 0, 1: 0, 2: 0 }), 3, '可以计算array-like的长度')

    var func = function () {
      return _.size(arguments)
    }
    assert.strictEqual(func(1, 2, 3, 4), 4, '可以计算arguments的长度')

    assert.strictEqual(_.size('hello'), 5, '可以计算字符串的长度')
    assert.strictEqual(_.size(new String('hello')), 5, '可以计算字符串数组的长度')

    assert.strictEqual(_.size(null), 0, '支持null')
    assert.strictEqual(_.size(0), 0, '支持数字')
  })

  QUnit.test('partition', function (assert) {
    var list = [0, 1, 2, 3, 4, 5]
    assert.deepEqual(_.partition(list, function (x) { return x < 4 }), [[0, 1, 2, 3], [4, 5]], '支持布尔返回值')
    assert.deepEqual(_.partition(list, function (x) { return x & 1 }), [[1, 3, 5], [0, 2, 4]], '支持0和1返回值')
    assert.deepEqual(_.partition(list, function (x) { return x - 3 }), [[0, 1, 2, 4, 5], [3]], '支持其他数字的返回值')
    assert.deepEqual(_.partition(list, function (x) { return x > 1 ? null : true }), [[0, 1], [2, 3, 4, 5]], '支持null返回值')
    assert.deepEqual(_.partition(list, function (x) { if (x < 2) return true }), [[0, 1], [2, 3, 4, 5]], '支持undefined返回值')
    assert.deepEqual(_.partition({ a: 1, b: 2, c: 3 }, function (x) { return x > 1 }), [[2, 3], [1]], '支持对象')
    assert.deepEqual(_.partition(list, function (x, index) { return index % 2 }), [[1, 3, 5], [0, 2, 4]], '可以得到数组index')
    assert.deepEqual(_.partition(list, function (x, index, arr) { return x === arr.length - 1 }), [[5], [0, 1, 2, 3, 4]], '可以得到集合')
    // 默认迭代器
    assert.deepEqual(_.partition([1, false, true, '']), [[1, true], [false, '']], '默认迭代器')
    assert.deepEqual(_.partition([{ x: 1 }, { x: 0 }, { x: 1 }], 'x'), [[{ x: 1 }, { x: 1 }], [{ x: 0 }]], '传入字符串')

    // 执行上下文
    var predicate = function (x) { return x === this.x }
    assert.deepEqual(_.partition([1, 2, 3], predicate, { x: 2 }), [[2], [1, 3]], '传入执行上下文参数')

    assert.deepEqual(_.partition([{ a: 1 }, { b: 2 }, { a: 1, b: 2 }], { a: 1 }), [[{ a: 1 }, { a: 1, b: 2 }], [{ b: 2 }]], '断言函数可以是object')

    var object = { a: 1 }
    _.partition(object, function (val, key, obj) {
      assert.strictEqual(val, 1)
      assert.strictEqual(key, 'a')
      assert.strictEqual(obj, object)
      assert.strictEqual(this, predicate)
    }, predicate)
  })
})()