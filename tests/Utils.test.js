const Utils = require('../src/lib/Utils');

const testMatrix = [
    [0, 1],
    [2, 3]
]

test('Utils#reverse', () => {
    expect(Utils.reverseArray([0,1,2,3,4])).toEqual([4,3,2,1,0]);
})

test('Utils#rotateMatrix90', () => {
    let expected = [
        [2, 0],
        [3, 1]
    ]

    expect(Utils.rotateMatrix90(testMatrix)).toEqual(expected);
})

test('Utils#rotateMatrix180', () => {
    let expected = [
        [3, 2],
        [1, 0]
    ]

    expect(Utils.rotateMatrix180(testMatrix)).toEqual(expected);
})

test('Utils#rotateMatrix270', () => {
    let expected = [
        [1, 3],
        [0, 2]
    ]

    expect(Utils.rotateMatrix270(testMatrix)).toEqual(expected);
})

test('Utils#cloneMatrix', () => {
    let expected = [
        [0, 1],
        [2, 3]
    ]

    expect(Utils.cloneMatrix(testMatrix)).not.toBe(testMatrix);
    expect(Utils.cloneMatrix(testMatrix)).toEqual(expected);
})

test('Utils#cloneMatrix', () => {
    let expected = [
        [null, null],
        [null, null]
    ]

    expect(Utils.createSquareMatrix(2)).toEqual(expected);
})

