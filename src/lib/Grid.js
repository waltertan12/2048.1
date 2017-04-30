// @flow
import Tile from './Tile'

class Grid {
    state: Array<Array<?Tile>>;
    size: number;

    /**
     * @param {number} size
     */
    constructor(size: number, previousState: any) {
        this.state = previousState ? createGridFromState() : createEmptyGrid(size) 
        this.size = size
    }

    /**
     * @param {number}    x
     * @param {number}    y
     * @param {Tile|null} tile
     */
    addTile(x: number, y: number, tile: Tile): Grid {
        if (this.validPosition(x, y))
            this.state[x][y] = tile

        return this
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    removeTile(x: number, y: number): Grid {
        this.state[x][y] = null

        return this
    }

    /**
     * @param  {number}  x
     * @param  {number}  y
     * @return {boolean}
     */
    validPosition(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.size && y < this.size
    }
}

/**
 * @param  {number}         size
 * @return {Array[Tile[]]}  state
 */
const createGrid = (size: number): Array<Array<?Tile>> => {
    let state = []

    for (let x = 0; x < size; x++) {
        state.push([])

        for (let y = 0; y < size; y++) {
            state[x].push(null)
        }
    }

    return state
}

const createGridFromState = (size: number, previousState: Array<Array<?number>): Array<Array<?Tile>> => {
    let state = []

    for (let x = 0; x < size; x++) {
        state.push([])

        for (let y = 0; y < size; y++) {
            if (previousState[x][y])
                state[x].push(new Tile(previousState[x][y]))
            else
                state[x].push(null)
        }
    }

    return state
}

module.exports = Grid

