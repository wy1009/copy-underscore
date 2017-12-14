;(function () {
    QUnit.test('map/flatten/reduce', function (assert) {
        var lyrics = [
            'I\'m a lumberjack and I\'m okay',
            'I sleep all night and I work all day',
            'He\'s a lumberjack and he\'s okay',
            'He sleeps all night and he works all day'
        ]
        var counts = _.chain(lyrics)
            .map(function (line) { return line.split('') })
            .flatten()
            .reduce(function (hash, l) {
                hash[l] = hash[l] || 0
                hash[l]++
                return hash
            }, {})
            .value()
        assert.strictEqual(counts.a, 16, 'counted all the letters in the song')
        assert.strictEqual(counts.e, 10, 'counted all the letters in the song')
    })
})()