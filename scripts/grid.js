/* global console, Tile */
(function (root) {
  "use strict";

  var Grid = root.Grid = function (size) {
    this.size = size;
    this.grid = this.initialize(size);
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
    this.insertTile(position.x, position.y, null);
    this.print();
  };

  Grid.prototype.validPosition = function (position) {
    var x = position.x,
        y = position.y;

    return (
      x >= 0 && 
      y >= 0 && 
      x < this.size && 
      y < this.size && 
      this.grid[x][y] === null
    );
  };

  Grid.prototype.print = function () {
    for (var i = 0; i < this.grid.length; i++) {
      console.log(this.grid[i]);
    }
  };
})(this);