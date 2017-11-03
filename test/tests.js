QUnit.test('isArrayLike', function (assert) {
    assert.strictEqual(isArrayLike([1, 2, 3]), true, '能识别数组')
    assert.strictEqual(isArrayLike({ 'a': 'a', 'b': 'b', 'c': 'c' }), true, '能识别对象')
})