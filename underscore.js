;(function () {
    let root = typeof self === 'object' && self.self === self && self || {}

    var _ = function () {

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
        if (_.isFunction(val)) {
            return optimizCb(val, context)
        }
        return _.property(val)
    }

    // *?*1 不知道为什么要这么写，姑且理解为是基于函数式编程“只传一个参数”的规定吧
    // *!*1 写到后面意识到该问题的答案有可能是，防止object为空却取属性出错。
    // *?*1 也不知道为什么一定要把函数写成函数表达式而不是函数声明，导致函数表达式一定要放在函数调用的前面
    var shallowProperty = function (key) {
        return function (obj) {
            // 用void 0代替undefined，防止undefined被重写
            return !obj ? void 0 : obj[key]
        }
    }

    // 帮助集合方法确定一个集合应该被当做数组还是对象来迭代
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1 // 能精确表示的最大整数
    var getLength = shallowProperty('length')
    var isArrayLike = function (collection) {
        var length = getLength(collection)
        return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
    }

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
    }

    // 取出对象自有属性的名字
    _.keys = function (obj) {
        if (!_.isObject(obj)) {
            return []
        }
        if (Object.keys) {
            return Object.keys(obj)
        }
        var keys = []
        for (var key in obj) {
            // 防止将原型中的自定义属性和方法也推入到数组
            if (_.has(obj, key)) {
                keys.push(key)
            }
        }
        // 等待走解决<IE9的bug路线
        return keys
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

    // 返回array-like中通过断言测试的第一个值的index
    _.findIndex = function (array, predicate, context) {
        predicate = cb(predicate, context)
        // predicate为function () { return func.apply(context, arguments) }，完美保存下特定执行上下文的函数
        // 具体来说，闭包保存变量值，return一个执行函数保证设置特定执行上下文且函数当时还可以不执行
        for (var i = 0; i < getLength(array); i ++) {
            if (predicate(array[i], i, array)) {
                return i
            }
        }
        return -1
    }

    // 取出对象所有自有属性的值，依赖_.keys，所以取出的是自有属性，不包括原型属性
    _.values = function (obj) {
        var keys = _.keys(obj)
        var values = []
        for (var i = 0; i < keys.length; i ++) {
            values.push(obj[keys[i]])
        }
        return values
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

    // 传入的变量是否是对象类型。函数、object、数组、DOM元素被视为对象类型。
    _.isObject = function (obj) {
        var type = typeof obj
        // typeof null为object，不会继续判断，因此type === 'function'与type === 'object'顺序不能颠倒
        return type === 'function' || type === 'object' && !!obj
    }

    // 传入的变量是否为数组
    _.isArray = Array.isArray || function (obj) {
        // 借用Object原型上的函数，保证原型链上没有Object.prototype的变量也能使用该方法
        return Object.prototype.toString.call(obj) === '[object Array]'
    }

    // 传入的变量是否为函数
    _.isFunction = function (obj) {
        return typeof obj === 'function'
    }
})()