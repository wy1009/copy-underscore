;(function () {
    let root = typeof self === 'object' && self.self === self && self || {}

    // ES5原生函数实现
    var nativeKeys = Object.keys

    var _ = function () {

    }

    root._ = _

    // 内部函数，对传入的callback返回一个优化版本，以被underscore的其他函数重复接受
    var optimizCb = function (func, context) {
        
    }

    // *?*1 不知道为什么要这么写，姑且理解为是基于函数式编程“只传一个参数”的规定吧
    // *?*1 顺便一提也不知道为什么一定要把函数写成函数表达式而不是函数声明，导致函数表达式一定要放在函数调用的前面
    var shallowProperty = function (key) {
        return function (obj) {
            // 用void 0代替undefined，防止undefined被重写
            return obj === null ? void 0 : obj[key]
        }
    }

    var getLength = shallowProperty('length')

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1 // 能精确表示的最大整数
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

    _.keys = function () {

    }

    _.isObject = function (obj) {
        var type = typeof obj
        return type === 'object' || type === 'function' && !!obj // *?*2 此处为什么一定要强制转换为Boolean值
    }
})()