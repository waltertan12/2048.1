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
    this.tiles = [];
  };

  Game.prototype.addTile = function () {
    var position = this.grid.randomPosition();
    this.grid.addTile(position, _INITIAL_VALUE);
    this.tiles.push(this.grid.grid[position.x][position.y]);
  };

  Game.prototype.slide = function (direction) {
    var tile = this.tiles[0];

    var endPosition = this.findEndPosition(direction, tile);
    this.moveTile(tile, endPosition);
    this.grid.print();
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
    
    if () {

    }
  };
})(this);