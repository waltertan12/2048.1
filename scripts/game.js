/* global Grid */
(function (root) {
  "use strict";

  var _INITIAL_SCORE = 0,
      _INITIAL_VALUE = 1,
      DIRECTIONS = {
        "left":  {x: -1, y:  0},
        "right": {x:  1, y:  0},
        "up":    {x:  0, y:  1},
        "down":  {x:  0, y: -1}
      };

  var Game = root.Game = function (size) {
    this.size = size;
    this.score = 0;
    this.grid = new Grid(size);
  };

  Game.prototype.addTile = function () {
    var position = this.grid.randomPosition();
    this.grid.addTile(position, _INITIAL_VALUE);
  };

  Game.prototype.slide = function (direction) {
    var tiles = this.tileOrder(direction),
        game = this;

    tiles.forEach(function (tile) {
      var endPosition = game.findEndPosition(direction, tile);
      game.moveTile(tile, endPosition);
      game.grid.print();
    })
  };

  Game.prototype.moveTile = function (tile, newPosition) {
    this.grid.grid[tile.x][tile.y] = null;
    this.grid.grid[newPosition.x][newPosition.y] = tile;

    tile.updatePosition(newPosition);
  };

  Game.prototype.validNextPosition = function (nextPosition) {
    return this.grid.validPosition(nextPosition);
  };

  Game.prototype.findEndPosition = function (direction, tile) {
    var x = tile.x,
        y = tile.y,
        dX = DIRECTIONS[direction].x,
        dY = DIRECTIONS[direction].y,
        nextPosition = {x: x, y: y};

    while (this.validNextPosition({x: x + dX, y: y + dY})) {
      x = x + dX;
      y = y + dY;
      nextPosition = {x: x, y: y};
    }

    return nextPosition;
  };

  Game.prototype.tileOrder = function (direction) {
    var tiles = [],
        grid = this.grid.grid;

    switch (direction) {
      // check all tiles on row this.grid.grid[0][] first
      case "left":
        for (var x = 0; x < grid.length; x++) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[x][y] !== null) {
              tiles.push(grid[x][y]);
            } 
          }
        }
        break;

      // check all tiles on row this.grid.grid[size-1][] first
      case "right":
        for (var x = this.size - 1; x >= 0; x--) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[x][y] !== null) {
              tiles.push(grid[x][y]);
            } 
          }
        }
        break;

      // check all tiles on col this.grid.grid[][size-1] first
      case "up":
        for (var x = this.size - 1; x >= 0; x--) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[y][x] !== null) {
              tiles.push(grid[y][x]);
            } 
          }
        }
        break;

      // check all tiles on col this.grid.grid[][0] first
      case "down":
        for (var x = 0; x < grid.length; x++) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[y][x] !== null) {
              tiles.push(grid[y][x]);
            } 
          }
        }
        break;
    }

    return tiles;
  };
})(this);