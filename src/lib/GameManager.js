// @flow
import GameLogic from './GameLogic'
import Grid from './Grid'
import Tile from './Tile'

const GRID_SIZE = 4

class GameManager {
    state: Grid;
    score: number;

    constructor(state: ?Array<Array<?number>>) {
        this.grid = new Grid(GRID_SIZE, state)
        this.score = 0
    }

    setState(state: Grid) {
        return new GameManager(state)
    }

    getNextState(direction: string): Grid {
        return new Grid(GRID_SIZE)
    }
}

module.exports = GameState
