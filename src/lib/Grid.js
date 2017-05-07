// @flow

import Utils from './Utils'

class Grid {
    state: Array<Array<?number>>;
    size: number;

    constructor(size: number, state: ?Array<Array<?number>>) {
        if (state) {
            this.state = state
            this.size = this.state.length
        } else {
            this.state = Utils.createSquareMatrix(size) 
            this.size = size
        }
    }

    getTile(x: number, y: number): ?number {
        if (this.validPosition(x, y)) 
            return this.state[x][y]

        return null
    }

    setTile(x: number, y: number, tile: ?number): Grid {
        if (!this.validPosition(x, y))
            throw new Error(`Invalid coordinates (${x}, ${y})`)

        let newState = Utils.cloneMatrix(this.state)
        
        newState[x][y] = tile || null

        return new Grid(this.size, newState)
    }

    setTiles(tiles: Array<any>) {
        return tiles.reduce((newState, tile) => {
            if (!this.validPosition(tile.x, tile.y))
                continue // TODO: Maybe throw an exception and catch it

            newState[tile.x][tile.y] = tile.tile

            return newState
        }, Utils.cloneMatrix(this.state))
    }

    removeTile(x: number, y: number): Grid {
        return this.setTile(x, y, null)
    }

    validPosition(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.size && y < this.size
    }

    getEmptyPositions(): Array<any> {
        let emptyPositions = []

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.state[x][y] === null) 
                    emptyPositions.push({x: x, y: y})
            }
        }

        return emptyPositions
    }

    rotate(): Grid {
        return new Grid(this.size, Utils.rotateMatrix90(this.state))
    }

    clone(): Grid {
        return new Grid(this.size, Utils.cloneMatrix(this.state))
    }

    print() {
        this.state.forEach(x => console.log(x.join(', ')))
    }
}

module.exports = Grid
