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

    for (var x = 0; x < size; x++) {
      grid.push([]);
      for (var y = 0; y < size; y++) {
        grid[x][y] = null;
      }
    }

    return grid;
  };

  Grid.prototype.availablePositions = function () {
    var availablePositions = [];

    for (var x = 0; x < this.grid.length; x++) {
      for (var y = 0; y < this.grid[x].length; y++) {
        if (this.grid[x][y] === null) {
          availablePositions.push({x: x, y: y});
        }
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
    this.print();
  };

  Grid.prototype.removeTile = function (position) {
    this.grid[position.x][position.y] = null;
    this.print();
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
    for (var x = 0; x < this.grid.length; x++) {
      for (var y = 0; y < this.grid[x].length; y++) {
        callback(x, y, this.grid[x][y]);
      }
    }
  };

  Grid.prototype.print = function () {
    var string = "";
    console.log("////////////////////////////");
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid.length; j++) {
        if (this.grid[i][j] === null) {
          string = string + "0 ";
        } else {
          string = string + this.grid[i][j].value + " ";
        }
      }
      console.log(string);
      string = "";
    }
  };
})(this);