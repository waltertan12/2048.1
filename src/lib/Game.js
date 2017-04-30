// @flow
import Grid from './Grid'
import Tile from './Tile'

const GRID_SIZE = 4

class Game {
    state: Grid;

    constructor() {
        this.state = new Grid(GRID_SIZE)
    }

    setState(grid: Grid) {
        this.state = state

        return this
    }

    getNextState(direction: string): Grid {
        return new Grid(GRID_SIZE)
    }
}

module.exports = Game
