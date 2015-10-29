/* global console, Tile */
(function (root) {
  "use strict";

  var Grid = root.Grid = function (size, grid) {
    this.size = size;
    if (typeof grid === "undefined") {
      this.grid = this.initialize(size);
    } else {
      this.grid = this.buildGrid(grid);
    }
  };

  Grid.prototype.buildGrid = function (grid) {
    var newGrid = this.initialize(grid.size);

    grid.each( function (x, y, tile) {
      if (tile !== null) {
        newGrid[x][y] = new Tile({x: x, y: y}, tile.value);
      }
    })

    return newGrid;
  };

  Grid.prototype.initialize = function (size) {
    var grid = [];

    for (var x = 0, y = 0; 
         x < size && y < size;
         y++,
         x = (y === size) ? x + 1 : x,
         y = (y === size) ? y = 0 : y) {
      if (x === 0) {
        grid.push([]);
      }
      grid[x][y] = null;
    }

    return grid;
  };

  Grid.prototype.availablePositions = function () {
    var availablePositions = [];
    var size = this.size;

    for (var x = 0, y = 0; 
         x < size && y < size;
         y++,
         x = (y === size) ? x + 1 : x,
         y = (y === size) ? y = 0 : y) {
      if (this.grid[x][y] === null) {
        availablePositions.push({x: x, y: y});
      }
    }

    return availablePositions;
  };

  Grid.prototype.randomPosition = function () {
    var availablePositions = this.availablePositions(),
        index = Math.floor(Math.random() * availablePositions.length);
    return availablePositions[index];
  };

  Grid.prototype.addTile = function (position, value) {
    if (value === null) {
      value = 1;
    }

    this.grid[position.x][position.y] = new Tile(position, value);
  };

  Grid.prototype.removeTile = function (position) {
    this.grid[position.x][position.y] = null;
  };

  Grid.prototype.validPosition = function (position) {
    var x = position.x,
        y = position.y;

    return (
      x >= 0 && 
      y >= 0 && 
      x < this.size && 
      y < this.size
    );
  };

  Grid.prototype.each = function (callback) {
    var size = this.size;
    for (var x = 0, y = 0; 
         x < size && y < size;
         y++,
         x = (y === size) ? x + 1 : x,
         y = (y === size) ? y = 0 : y) {
      callback(x, y, this.grid[x][y]);
    }
  };
})(this);