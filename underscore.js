;(function () {
    let root = typeof self === 'object' && self.self === self && self || {}

    var _ = function () {

    }

    root._ = _

    // 内部函数，对传入的callback返回一个优化版本，以被underscore的其他函数重复接受
    var optimizCb = function (func, context) {
        
    }

    // *?*1 不知道为什么要这么写，姑且理解为是基于函数式编程“只传一个参数”的规定吧
    // *?*1 也不知道为什么一定要把函数写成函数表达式而不是函数声明，导致函数表达式一定要放在函数调用的前面
    var shallowProperty = function (key) {
        return function (obj) {
            // 用void 0代替undefined，防止undefined被重写
            return obj === null ? void 0 : obj[key]
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

        }
    }

    _.values = function (obj) {
        var keys = _.keys(obj)
        var values = Array(keys.length)
        for (var i = 0; i < keys.length; i ++) {
            values[i] = obj[keys[i]]
        }
        return values
    }

    _.keys = function (obj) {
        if (!_.isObject(obj)) {
            return []
        }
        if (Object.keys) {
            return Object.keys(obj)
        }
        var keys = []
        for (var key in obj) {
            // 防止将原型中的方法和属性也推入到数组
            if (_.has(obj, key)) {
                keys.push(key)
            }
        }
        return keys
    }

    _.has = function (obj, path) {
        if (!_.isArray(path)) {
            return obj && Object.prototype.hasOwnProperty.call(obj, path)
        }
        for (var i = 0; i < path.length; i ++) {
            if (!obj || !Object.prototype.hasOwnProperty.call(obj, path[i])) {
                return false
            }
            obj = obj[path[i]]
        }
        return !!path.length
    }

    // 传入的变量是否是对象
    _.isObject = function (obj) {
        var type = typeof obj
        return type === 'object' || type === 'function' && !!obj
    }

    // 传入的变量是否为数组
    _.isArray = Array.isArray || function (obj) {
        // 借用Object原型上的函数，保证原型链上没有Object.prototype的变量也能使用该方法
        return Object.prototype.toString.call(obj) === '[object Array]'
    }
})()