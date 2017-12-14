;(function () {
    let root = typeof self === 'object' && self.self === self && self || {}

    var _ = function (obj) {
        if (!(this instanceof _)) {
            return new _(obj)
        }
        this._wrapper = obj
    }

    root._ = _

    // 内部函数，对传入的callback返回一个优化版本，以被underscore的其他函数重复接受
    var optimizCb = function (func, context) {
        if (context === void 0) {
            return func
        }
        return function () {
            return func.apply(context, arguments)
        }
    }

    // 返回统一的callback函数
    var cb = function (val, context) {
        // 传入值本身就是一个函数，返回一个执行上下文为context的该函数
        if (_.isFunction(val)) {
            return optimizCb(val, context)
        }
        // 传入值为空，返回一个传入什么就返回什么的函数
        // 这是为了统一，在调用cb之后，不管是否实际传入了处理数据的函数，都可以统一当做函数处理
        // 原例为val == null，即undefined和null都能判定为true
        // 考虑到传入null（虽然一般不会这样做），不会是想要作为对象的取值路径处理（即最后一步），因此这样处理
        // 但其实，undefined和null被放入最后一步作为对象取值路径处理也不会出错，也可以被作为属性名，被处理为字符串
        // 即obj[null] === obj['null']
        if (val === void 0 || val === null) {
            return _.identity
        }
        if (_.isObject(val) && !_.isArray(val)) {
            return _.matcher(val)
        }
        // 传入值不是以上任何类型，当做对象的取值路径处理，返回一个可以传入对象，返回按照该路径取的值的函数
        return _.property(val)
    }

    // 注释说是与es6中的rest parameters相同，但感觉原代码只是switch后的那部分的功能与rest parameters相同
    // 简单说，功能就是，统一将arguments为多个参数的部分收集为一个数组，如func(func, a, b, c, d)
    // 目的就是将所有这样设计的方法的abcd部分统一收集为数组，方便处理
    var restArgs = function (func, startIndex) {
        startIndex = startIndex === void 0 ? func.length - 1 : startIndex
        return function () {
            var rest = []
            for (var i = 0; i < arguments.length - startIndex; i ++) {
                rest[i] = arguments[i + startIndex]
            }
            switch (startIndex) {
                case 1: return func.call(this, arguments[0], rest); break
                case 2: return func.call(this, arguments[0], arguments[1], rest); break
            }
        }
    }

    // 创建一个构造函数为既定prototype的实例
    var Ctor = function () {}
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) {
            return
        }
        if (Object.create) {
            return Object.create(prototype)
        }
        Ctor.prototype = prototype
        var result = new Ctor()
        Ctor.prototype = null
        return result
    }

    // *?*1 不知道为什么要这么写，姑且理解为是基于函数式编程“只传一个参数”的规定吧
    // *!*1 写到后面意识到该问题的答案有可能是，防止object为空却取属性出错。
    // *?*1 也不知道为什么一定要把函数写成函数表达式而不是函数声明，导致函数表达式一定要放在函数调用的前面
    var shallowProperty = function (key) {
        return function (obj) {
            // 用void 0代替undefined，防止undefined被重写
            return obj === null || obj === void 0 ? void 0 : obj[key]
        }
    }

    // 帮助集合方法确定一个集合应该被当做数组还是对象来迭代
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1 // 能精确表示的最大整数
    var getLength = shallowProperty('length')
    var isArrayLike = function (collection) {
        var length = getLength(collection)
        return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
    }

    // Collections - 集合

    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizCb(iteratee, context)
        if (isArrayLike(obj)) {
            for (var i = 0; i < obj.length; i ++) {
                iteratee(obj[i], i, obj)
            }
        } else {
            var keys = _.keys(obj)
            for (var i = 0; i < keys.length; i ++) {
                iteratee(obj[keys[i]], keys[i], obj)
            }
        }
        return obj
    }

    // 将传入的array/object逐项处理，返回处理后的value数组
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context)
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = []
        for (var i = 0; i < length; i ++) {
            var key = keys ? keys[i] : i
            results.push(iteratee(obj[key], key, obj))
        }
        return results
    }

    var createReducer = function (dir) {
        return function (obj, iteratee, memo, context) {
            iteratee = optimizCb(iteratee, context)
            var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length

            var i = dir > 0 ? 0 : length - 1
            if (memo === void 0) {
                memo = keys ? obj[keys[i]] : obj[i]
                i += dir
            }
            for (; i >= 0 && i < length; i += dir) {
                var key = keys ? keys[i] : i
                memo = iteratee(memo, obj[key], key, obj)
            }
            return memo
        }
    }

    // 把list中的元素归结为一个单独的值，memo是初始值，会被每一次成功调用iteratee函数的返回值所取代
    _.reduce = _.foldl = _.inject = createReducer(1)
    _.reduceRight = _.foldr = createReducer(-1)

    // 返回对象或数组中第一个通过断言测试的value。
    _.find = _.detect = function (obj, predicate, context) {
        var finder = isArrayLike(obj) ? _.findIndex : _.findKey
        var key = finder(obj, predicate, context)
        if (key !== -1 && key !== void 0) {
            return obj[key]
        }
    }

    // 返回所有能够通过所有断言测试的值。如果是对象，也只返回值。
    _.filter = function (obj, predicate, context) {
        predicate = cb(predicate, context)
        var results = []
        _.each(obj, function (val, index, list) {
            if (predicate(val, index, list)) {
                results.push(val)
            }
        })
        return results
    }

    // 和向filter直接传入obj是同样的表现，即筛选出对象列表中能匹配attrs的对象
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs))
    }

    // 和向find直接传入obj是同样的表现，即返回对象列表（或对象）中第一个能匹配attrs的对象（或值）
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs))
    }

    // 返回obj中没有通过predicate真值检测的集合，与filter相反
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate, context)))
    }

    var createChecker = function (dir) {
        return function (obj, predicate, context) {
            predicate = cb(predicate, context)
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length
            if (!keys && !dir && Array.prototype.every) {
                return Array.prototype.every.call(obj, predicate)
            }
            if (!keys && dir && Array.prototype.some) {
                return Array.prototype.some.call(obj, predicate)
            }
            for (var i = 0; i < length; i ++) {
                var currentKey = keys ? keys[i] : i
                if (!!predicate(obj[currentKey], currentKey, obj) === dir) {
                    return dir
                }
            }
            return !dir
        }
    }

    // 如果obj中所有元素都通过predicate真值检测就返回true
    _.every = _.all = createChecker(false)

    // 如果obj中有一个元素通过predicate纸质检测就返回true
    _.some = _.any = createChecker(true)

    // 列表或对象中是否包含给定的值
    _.contains = _.includes = _.include = function (obj, item, fromIndex) {
        if (!isArrayLike(obj)) {
            obj = _.values(obj)
        }
        return _.indexOf(obj, item, fromIndex) >= 0
    }

    _.invoke = restArgs(function (obj, path, args) {
        var func,
            contextPath
        if (_.isFunction(path)) {
            func = path
        } else if (_.isArray(path)) {
            contextPath = path.slice(0, -1)
            path = path[path.length - 1]
        }
        return _.map(obj, function (item) {
            var method = func,
                context = contextPath && contextPath.length ? deepGet(item, contextPath) : item
            if (!method) {
                if (context === null || context === void 0) {
                    return void 0
                }
                method = context[path]
            }
            return method === null || method === void 0 ? method : method.apply(context, args)
        })
    })

    // 是map最常使用的用例模型简化版本，即萃取对象中某属性值，返回一个数组
    _.pluck = function (obj, key) {
        // 不能够直接把key传入，因为该方法只针对_.property，不管什么类型都应当做property处理
        // 而cb方法会根据类型判断
        return _.map(obj, _.property(key))
    }

    var createComparer = function (dir) {
        return function (obj, iteratee, context) {
            var result = dir
            // 单独处理each/map等自动向回调函数传入index的方法
            if (iteratee === null || iteratee === void 0 || (_.isNumber(iteratee) && typeof obj[0] !== 'object')) {
                _.each(obj, function (val) {
                    if (val !== null && (dir === -Infinity ? val > result : val < result)) {
                        result = val
                    }
                })
            } else {
                var resultComputed = dir, // 目前最大/最小的计算值
                    computed // 本次计算值
                iteratee = cb(iteratee, context)
                _.each(obj, function (val) {
                    computed = iteratee(val)
                    // 被遍历对象本身就有值为负无穷时特殊处理
                    if (computed !== null && (dir === -Infinity ? computed > resultComputed : computed < resultComputed) || computed === dir && result === dir) {
                        result = val
                        resultComputed = computed
                    }
                })
            }
            return result
        }
    }

    _.max = createComparer(-Infinity)
    _.min = createComparer(Infinity)

    // 返回一个排序好的新数组
    _.sortBy = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context)
        var index = 0
        return _.pluck(_.map(obj, function (val) {
            return {
                val: val,
                index: index ++,
                criteria: iteratee(val)
            }
        }).sort(function (a, b) {
            if (a.criteria > b.criteria || a.criteria === void 0) { // 将undefined排在后面
                return 1
            }
            if (a.criteria < b.criteria || b.criteria === void 0) {
                return -1
            }
            // 原本等于0则a和b相对位置不变，ECMAScript不保证这一行为，也不是所有浏览器都会遵守
            return a.index - b.index
        }), 'val')
    }

    var group = function (behavior, partition) {
        return function (obj, iteratee, context) {
            iteratee = cb(iteratee, context)
            var result = partition ? [[], []] : {}
            _.each(obj, function (val, index) {
                var key = iteratee(val, index, obj)
                behavior(result, val, key)
            })
            return result
        }
    }

    // 依照iteratee的结果分组
    _.groupBy = group(function (result, val, key) {
        if (!_.has(result, key)) {
            result[key] = []
        }
        result[key].push(val)
    })

    // 类似groupBy，确定每个索引只有一个值的时候可以用，同索引后面的值覆盖前面的
    _.indexBy = group(function (result, val, key) {
        result[key] = val
    })

    // 类似groupBy，返回的不是该组的值，而是该组中值的数目
    _.countBy = group(function (result, val, key) {
        if (!_.has(result, key)) {
            result[key] = 1
        } else {
            result[key] ++
        }
    })

    // 返回一个乱序列表副本
    _.shuffle = function (obj) {
        if (!isArrayLike(obj)) {
            obj = _.values(obj)
        }
        return _.sample(obj, obj.length)
    }

    // 从list中产生一个随机副本。不传n则返回单一随机项，传则从list中返回n个随机数。
    _.sample = function (obj, n) {
        if (n === null || n === void 0) {
            if (!isArrayLike(obj)) {
                obj = _.values(obj)
            }
            return obj[_.random(obj.length - 1)]
        }
        obj = isArrayLike(obj) ? _.clone(obj) : _.values(obj)
        var length = getLength(obj)
        // 防止负数n和n > length的情况
        n = Math.max(Math.min(length, n), 0)
        // 做法好聪明，把取到的随机值与开头的值挨个交换，下次随机跳过开头
        // 既保证取值不重复，又能够直接将取到的值汇总到开头，直接截取开头返回
        for (var i = 0; i < n; i ++) {
            var rand = _.random(i, length - 1),
                tmp = obj[rand]
            obj[rand] = obj[i]
            obj[i] = tmp
        }
        return obj.slice(0, n)
    }

    // 安全创建一个数组
    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g
    _.toArray = function (obj) {
        if (!obj) {
            return []
        }
        if (_.isArray(obj)) {
            return Array.prototype.slice.call(obj)
        }
        if (_.isString(obj)) {
            return obj.match(reStrSymbol)
        }
        // 不知道原代码为什么要专门对array-like对象加一个_.map(obj, _.identity)的写法
        // 不这样写同样可以通过所有的测试用例
        return _.values(obj)
    }

    // 列表的长度
    _.size = function (obj) {
        return isArrayLike(obj) ? obj.length : _.keys(obj).length
    }

    // 拆分对象为两个数组，第一个数组其元素都满足predicate迭代函数，第二个数组其元素均不能满足predicate
    _.partition = group(function (result, val, pass) {
        result[pass ? 0 : 1].push(val)
    }, true)

    // Arrays - 数组

    var flatten = function (obj, result) {
        result = result || []
        if (!isArrayLike(obj)) {
            result.push(obj)
            return
        }
        var length = getLength(obj)
        for (var i = 0; i < length; i ++) {
            if (isArrayLike(obj[i])) {
                flatten(obj[i], result)
            } else {
                result.push(obj[i])
            }
        }
        return result
    }

    _.flatten = function (obj, shallow) {
        if (!isArrayLike(obj)) {
            return []
        }
        if (shallow) {
            var length = getLength(obj),
                result = []
            for (var i = 0; i < length; i ++) {
                if (isArrayLike(obj[i])) {
                    for (var j = 0; j < obj[i].length; j ++) {
                        result.push(obj[i][j])
                    }
                } else {
                    result.push(obj[i])
                }
            }
            return result
        } else {
            return flatten(obj)
        }
    }

    // 二分法查找能插入值的最小index
    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context)
        var value = iteratee(obj)
        var low = 0,
            high = getLength(array)
        while (low < high) {
            var mid = Math.floor((low + high) / 2)
            if (iteratee(array[mid]) < value) {
                low = mid + 1
            } else {
                high = mid
            }
        }
        return low
    }

    var string2Num = function (obj) {
        // 若直接判断isNaN，''和null都会被Number转换为0，不符合预期
        // 使用parseInt，则'123a' -> '123'，不符合预期
        if (_.isNumber(obj) || _.isString(obj) && obj && !_.isNaN(Number(obj))) {
            return Number(obj)
        }
    }

    var createIndexFinder = function (dir, sortedIndex) {
        return function (array, item, idx) {
            var length = getLength(array)
            if (typeof idx === 'boolean' && idx && sortedIndex && length) {
                var result = sortedIndex(array, item)
                return array[result] === item ? result : -1
            } else {
                // idx为数字或数字字符串
                // 将idx替换为真正处于数组中的index
                var num = string2Num(idx)
                if (num !== void 0) {
                    idx = num
                    // fromIndex本就比0小还从后向前查找，或fromIndex本来就比length - 1大还从前向后查找
                    // 必然返回-1
                    // 一开始处理方法为将index处理为-1或length，再走正常流程，但是这样会导致查找值为undefined时出现查找值，而不是-1
                    // 因为arr[length]正是undefined
                    if (dir < 0 && length + idx < 0 || dir > 0 && idx > length - 1) {
                        return -1
                    }
                    idx = idx < 0 ? Math.max(length + idx, 0) : Math.min(idx, length - 1)
                } else {
                    idx = dir < 0 ? length - 1 : 0
                }
            }
            for (var i = idx; i < length && i >= 0; i += dir) {
                if (array[i] === item) {
                    return i
                }
            }
            return -1
        }
    }

    _.indexOf = createIndexFinder(1, _.sortedIndex)
    _.lastIndexOf = createIndexFinder(-1)

    var createPredicateIndexFinder = function (dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context)
            var length = getLength(array)
            for (var i = dir > 0 ? 0 : length - 1; i >= 0 && i < length; i += dir) {
                if (predicate(array[i], i, array)) {
                    return i
                }
            }
            return -1
        }
    }

    // 返回array-like中通过断言测试的第一个值的index
    _.findIndex = createPredicateIndexFinder(1)

    // 返回array-like中通过断言测试的最后一个index
    _.findLastIndex = createPredicateIndexFinder(-1)

    // 创建整数数组
    _.range = function (start, stop, step) {
        if (stop === null || stop === void 0) {
            stop = start
            start = 0
        }
        if (!step) {
            step = stop > start ? 1 : -1
        }
        var length = Math.max(Math.ceil((stop - start) / step), 0),
            result = Array(length),
            val = start
        for (var i = 0; i < length; i ++) {
            result[i] = val
            val += step
        }
        return result
    }

    // Functions - 函数

    var executeBound = function (sourceFn, boundFn, callingContext, args) {
        // 普通地调用，而不是被作为构造函数调用（一般只有在构造函数中，this指向的对象才是函数的实例）
        if (!(callingContext instanceof boundFn)) {
            // 被apply进去的参数数组，undefined会变成字符串
            return sourceFn.apply(callingContext, args)
        }
        // callingContext的指向是boundFn的实例，说明此时boundFn正被作为构造函数使用
        // 此时boundFn的返回值就变得没有意义（一般是无返回值）
        // 此时则模拟new的步骤，创建一个有sourceFn原型的对象，然后执行构造函数
        // 该构造函数是boundFn，但是boundFn在意义上只是被处理过的sourceFn，即做出处理后return sourceFn执行的函数
        // 因此，我们希望创造出的实例，指向的prototype是sourceFn的prototype，执行的构造函数代码是sourceFn的代码
        // 也就是以下两步
        // 最终返回这个实例
        var self = baseCreate(sourceFn.prototype)
        sourceFn.apply(self, args)
        return self
    }

    // 返回一个带着部分已固定的参数的函数，这部分固定的参数可以用placeholder占位
    _.partial = restArgs(function (func, boundArgs) {
        var placeholder = _.partial.placeholder
        var bound = function () {
            var args = [],
                position = 0
            for (var i = 0; i < boundArgs.length; i ++) {
                args[i] = boundArgs[i] === placeholder ? arguments[position ++] : boundArgs[i]
            }
            for (var i = position; i < arguments.length; i ++) {
                args.push(arguments[i])
            }
            return executeBound(func, bound, this, args)
        }
        return bound
    })

    _.partial.placeholder = _

    // 返回传入断言函数的一个相反值
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments)
        }
    }

    // Objects - 对象

    // 用于处理IE<9的bug
    var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
        nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocalString']
    var collectNonEnumProps = function (obj, keys) {
        var proto = _.isFunction(obj.constructor) && obj.constructor.prototype || Object.prototype
        for (var i = 0; i < nonEnumerableProps.length; i ++) {
            var prop = nonEnumerableProps[i]
            // _.has只判断非原型属性是否存在，源码只有对constructor的单独处理是这样写的
            // 怀疑对constructor单独处理的原因是{ constructor: 补充原constructor }的写法比较常见
            // 由于是不同人写出的，怀疑只是不更改上一个人的写法，单单做缝补
            // 真心觉得这个方法可以适应所有属性，就这么写了
            if (_.has(obj, prop) && _.includes(keys, prop)) {
                keys.push(props)
            }
        }
    }

    var createKeysCollector = function (type) {
        return function (obj) {
            if (!_.isObject(obj)) {
                return []
            }
            if (Object.keys && type !== 'all') {
                return Object.keys(obj)
            }
            var keys = []
            for (var key in obj) {
                if (type === 'all') {
                    keys.push(key)
                } else {
                    // 防止将原型中的自定义属性和方法也推入到数组
                    if (_.has(obj, key)) {
                        keys.push(key)
                    }
                }
            }
            if (hasEnumBug) collectNonEnumProps(obj, keys)
            return keys
        }
    }

    // 取出对象自有属性的名字
    _.keys = createKeysCollector()
    // 取出对象所有属性的名字，包括原型链上的可枚举属性
    _.allKeys = createKeysCollector('all')

    // 取出对象所有自有属性的值，依赖_.keys，所以取出的是自有属性，不包括原型属性
    _.values = function (obj) {
        var keys = _.keys(obj)
        var values = []
        for (var i = 0; i < keys.length; i ++) {
            values.push(obj[keys[i]])
        }
        return values
    }

    // 返回一个对象中所有的方法名，且排序
    _.functions = _.methods = function (obj) {
        var names = []
        for (var key in obj) {
            if (_.isFunction(obj[key])) {
                names.push(key)
            }
        }
        return names.sort()
    }

    // 返回对象中第一个通过断言测试的key
    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context)
        var keys = _.keys(obj)
        for (var i = 0; i < keys.length; i ++) {
            var key = keys[i]
            if (predicate(obj[key], key, obj)) {
                return key
            }
        }
    }

    var createAssigner = function (keysFunc) {
        return function (obj) {
            var length = arguments.length
            if (length < 2 || obj === void 0 || obj === null) {
                return obj
            }
            for (var argI = 1; argI < length; argI ++) {
                var source = arguments[argI],
                    keys = keysFunc(source)
                for (var i = 0; i < keys.length; i ++) {
                    obj[keys[i]] = source[keys[i]]
                }
            }
            return obj
        }
    }

    // _.extend(destination, *sources)，赋值source对象中的所有属性覆盖到destination对象上，返回destination对象
    // 复制按顺序，如果有重复，后面的对象属性会覆盖前面的对象属性
    // 包括继承而来的属性，即原型链上的可枚举属性
    _.extend = createAssigner(_.allKeys)
    // 只复制自己的属性覆盖到目标对象，不包括原型链上的可枚举属性
    _.extendOwn = createAssigner(_.keys)

    // 浅复制的克隆obj
    _.clone = function (obj) {
        // 不是引用类型
        if (!_.isObject(obj)) {
            return obj
        }
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
    }

    // 检查一个对象中是否直接在它本身有某个属性，换句话说，不是原型属性
    _.has = function (obj, path) {
        if (!_.isArray(path)) {
            return !!obj && Object.prototype.hasOwnProperty.call(obj, path)
        }
        for (var i = 0; i < path.length; i ++) {
            if (!obj || !Object.prototype.hasOwnProperty.call(obj, path[i])) {
                return false
            }
            obj = obj[path[i]]
        }
        return !!path.length
    }

    // 返回一个断言函数。这个函数传入obj参数，断定attrs中的所有值是否都与obj中的值是相符的。
    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs)
        return function (obj) {
            return _.isMatch(obj, attrs)
        }
    }

    var deepGet = function (obj, path) {
        for (var i = 0; i < path.length; i ++) {
            if (!obj) {
                return void 0
            }
            obj = obj[path[i]]
        }
        return path.length ? obj : void 0
    }

    // 参数path，返回一个可以输入obj返回path（字符串或数组）属性值的函数
    _.property = function (path) {
        if (!_.isArray(path)) {
           return shallowProperty(path)
        }
        return function (obj) {
            return deepGet(obj, path)
        }
    }

    // 查找一个对象的所有属性是否都与另一个对象相同。待查找对象不包括原型属性，被检测对象包括原型属性。
    _.isMatch = function (obj, attrs) {
        var keys = _.keys(attrs),
            length = keys.length
        if (!obj) {
            return !length
        }
        obj = Object(obj) // 第一次看到强制类型转换为对象的
        for (var i = 0; i < length; i ++) {
            var key = keys[i]
            // 判断key in obj，防止两个值都是undefined，如_.isMatch({}, { x: void 0 })，不判断则返回true
            // keys取对象属性不包括原型属性，但取值和in操作符都包括原型属性。因此，需要查找的对象不包括原型属性，但是被检查的对象会被检查原型属性
            if (attrs[key] !== obj[key] || !(key in obj)) {
                return false
            }
        }
        return true
    }

    // 传入的变量是否为数组
    _.isArray = Array.isArray || function (obj) {
        // 借用Object原型上的函数，保证原型链上没有Object.prototype的变量也能使用该方法
        return Object.prototype.toString.call(obj) === '[object Array]'
    }

    // 传入的变量是否是对象类型。函数（typeof为function）、object、数组、DOM元素（后三个typeof皆为object）被视为对象类型。
    _.isObject = function (obj) {
        var type = typeof obj
        // typeof null为object，不会继续判断，因此type === 'function'与type === 'object'顺序不能颠倒
        return type === 'function' || type === 'object' && !!obj
    }

    // 传入的变量是否为函数
    _.isFunction = function (obj) {
        return typeof obj === 'function'
    }

    // 传入的变量是否是NaN
    _.isNaN = function (obj) {
        return _.isNumber(obj) && isNaN(obj)
    }

    _.each(['Arguments', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (item) {
        _['is' + item] = function (obj) {
            return Object.prototype.toString.call(obj) === '[object ' + item + ']'
        }
    })

    // Utility - 实用功能

    // 返回与传入参数相等的值的函数。在underscore中被作为默认的迭代器。
    _.identity = function (val) {
        return val
    }

    // 生成断言的函数
    _.constant = function (val) {
        return function () {
            return val
        }
    }

    // 默认可选的回调函数
    _.noop = function () {}

    // 生成min和max之间的随机整数，包括min和max。如果只传一个参数，则返回0到这个参数之间的整数
    _.random = function (min, max) {
        if (max === null || max === void 0) {
            max = min
            min = 0
        }
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // 将自己的方法扩展到Underscore，传递一个{ name: function }定义的哈希添加到Underscore对象，以及面向对象封装
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name]
            // 共有两种调用方式，_.xx或_().xx，前者直接调用_上的方法，只有后者才会调用prototype上的方法
            _.prototype[name] = function () {
                var args = [this._wrapper]
                args.push(arguments)
                return func.apply(_, args)
            }
        })
        return _
    }

    _.mixin(_)
})()