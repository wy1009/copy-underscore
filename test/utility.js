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

    QUnit.test('times', function (assert) {
        var vals = []
        _.times(3, function(i) { vals.push(i) })
        assert.deepEqual(vals, [0, 1, 2], 'is 0 indexed')
        vals = []
        _(3).times(function(i) { vals.push(i) })
        assert.deepEqual(vals, [0, 1, 2], 'works as a wrapper')
        // collects return values
        assert.deepEqual([0, 1, 2], _.times(3, function(i) { return i }), 'collects return values')

        assert.deepEqual(_.times(0, _.identity), [])
        assert.deepEqual(_.times(-1, _.identity), [])
        assert.deepEqual(_.times(parseFloat('-Infinity'), _.identity), [])
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

    QUnit.test('mixin', function (assert) {
        var ret = _.mixin({
            myReverse: function (string) {
                return string.split('').reverse().join('')
            }
        })
        assert.strictEqual(ret, _, '返回_对象帮助链式语法')
        assert.strictEqual(_.myReverse('panacea'), 'aecanap', '向_对象上混合了一个函数')
        assert.strictEqual(_('champ').myReverse(), 'pmahc', '也像_对象的原型上混合了这个方法')
    })
})()