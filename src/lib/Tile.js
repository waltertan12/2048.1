// @flow
class Tile {
    x: number;
    y: number;
    value: number;
    
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} value 
     */
    constructor(x: number, y: number, value: number) {
        this.x = x
        this.y = y
        this.value = value
        // this.previousX = null
        // this.previousY = null
    }
}

module.exports = Tile
