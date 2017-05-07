// @flow

const Utils = {
    rotateMatrix90: (matrix: Array<Array<any>>): Array<Array<any>> => {
        return Utils.transposeMatrix(matrix).map(x => Utils.reverseArray(x))
    },
    
    rotateMatrix180: (matrix: Array<Array<any>>): Array<Array<any>> => {
        return Utils.rotateMatrix90(Utils.rotateMatrix90(matrix))
    },

    rotateMatrix270: (matrix: Array<Array<any>>): Array<Array<any>> => {
        return Utils.transposeMatrix(matrix.map(x => Utils.reverseArray(x)))
    },

    reverseArray: (array: Array<any>): Array<any> => {
        let len = array.length

        return array.map((val, index) => {
            return array[len - index - 1]
        })
    },

    transposeMatrix: (matrix: Array<Array<any>>): Array<Array<any>> => {
        let len = matrix.length 
        let transposed = new Array(len)

        for (let x = 0; x < len; x++) {
            transposed[x] = new Array(len)

            for (let y = len - 1; y >= 0; y--) {
                transposed[x][y] = matrix[y][x]
            }
        }

        return transposed;
    },

    cloneMatrix: (matrix: Array<Array<any>>): Array<Array<any>> => {
        return matrix.map(arr => arr.map(val => val))
    },

    createSquareMatrix: (size: number): Array<Array<any>> => {
        return (new Array(size)).fill((new Array(size)).fill(null))
    }
}

module.exports = Utils
