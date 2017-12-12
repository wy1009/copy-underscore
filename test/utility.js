(function () {
    QUnit.test('identity', function (assert) {
        var stooge = { name: 'moe' }
        assert.strictEqual(_.identity(stooge), stooge)
    })
    
    QUnit.test('constant', function (assert) {
        var stooge = { name: 'moe' }
        assert.strictEqual(_.constant(stooge)(), stooge, '应当创建一个返回stooge的函数')
    })
    
    QUnit.test('noop', function (assert) {
        assert.strictEqual(_.noop('curly', 'larry', 'moe'), void 0, '应该永远返回undefined')
    })
    
    QUnit.test('random', function (assert) {
        var array = _.range(1000)
        var min = Math.pow(2, 31)
        var max = Math.pow(2, 62)

        assert.ok(_.every(array, function () {
            return _.random(min, max) >= min
        }), '应该生成一个大于等于min的整数')

        assert.ok(_.some(array, function() {
            return _.random(Number.MAX_VALUE) > 0
        }), '应该生成一个大于零的随机数')
    })
})()