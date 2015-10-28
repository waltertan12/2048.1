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
        grid = this.grid,
        game = this;

    tiles.forEach(function (tile) {
      var furthestPosition = game.furthestPosition(direction, tile),
          collisionTile = grid.grid[furthestPosition.x][furthestPosition.y];


      // Handle collision
      if (collisionTile !== null && 
          JSON.stringify(tile.position) !== JSON.stringify(furthestPosition) && 
          tile.isMatch(collisionTile)) {
        var mergedTile = new Tile(furthestPosition, tile.value + 1);
        grid.removeTile({x: tile.x, y: tile.y});
        grid.grid[furthestPosition.x][furthestPosition.y] = mergedTile;

      // No collision
      } else {
        var endPosition = game.endPosition(direction, tile);
        console.log("end position");
        console.log(endPosition);
        game.moveTile(tile, endPosition);
      }

      game.grid.print();
    })
  };

  Game.prototype.moveTile = function (tile, newPosition) {
    var grid = this.grid.grid;

    grid[tile.x][tile.y] = null;
    grid[newPosition.x][newPosition.y] = tile;

    tile.updatePosition(newPosition);
  };

  Game.prototype.validNextPosition = function (nextPosition) {
    return this.grid.validPosition(nextPosition);
  };

  Game.prototype.furthestPosition = function (direction, tile) {
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

  Game.prototype.endPosition = function (direction, tile) {
    var x = tile.x,
        y = tile.y,
        dX = DIRECTIONS[direction].x,
        dY = DIRECTIONS[direction].y,
        nextPosition = {x: x, y: y};

    while (this.validNextPosition({x: x + dX, y: y + dY}) &&
           this.grid.grid[x + dX][y + dY] === null) {
      x = x + dX;
      y = y + dY;
      nextPosition = {x: x, y: y};
    }

    return nextPosition;
  }

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

  Game.prototype.render = function() {
    this.addTile();
    var grid = this.grid.grid;

    for (var x = 0; x < grid.length; x++) {
      var row = document.getElementById("row-" + x);
      for (var y = 0; y < grid[x].length; y++) {
        if (grid[x][y] === null) {
          row.children[y].innerHTML = " ";
        } else {
          row.children[y].innerHTML = "" + grid[x][y].value;
        }
      }
    }
  };
})(this);