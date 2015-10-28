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

  Game.prototype.comparePositions = function(positionOne, positionTwo) {
    return (
      positionOne.x === positionTwo.x &&
      positionOne.y === positionTwo.y
    );
  };

  Game.prototype.addTile = function () {
    var position = this.grid.randomPosition();
    this.grid.addTile(position, _INITIAL_VALUE);
  };

  Game.prototype.slide = function (direction) {
    var positions = this.positionOrder(direction),
        grid = this.grid,
        game = this,
        tileMoved = false,
        tile, furthestPositions, mergePosition, collisionTile;

    game.resetTileMerges();

    positions.forEach(function (position) {
      tile = grid.grid[position.x][position.y];
      collisionTile = null;
      positions = game.furthestPosition(direction, tile);

      // does the space still have a tile?
      if (tile !== null) {
        mergePosition = positions.mergePosition;

        // Is there merge possibility?
        if (mergePosition !== null) {
          collisionTile = grid.grid[mergePosition.x][mergePosition.y];
        }
        
        // Is there an actual merge?
        if (!!collisionTile && 
            !game.comparePositions(position, mergePosition) && 
            tile.isMatch(collisionTile) &&
            !collisionTile.merged) {

          var mergedTile = new Tile(mergePosition, tile.value + 1);
          mergedTile.merged = true;

          grid.removeTile({x: tile.x, y: tile.y});
          grid.removeTile(mergePosition);
          grid.grid[mergePosition.x][mergePosition.y] = mergedTile;

          tileMoved = true;

        // no merge
        } else {
          var endPosition = positions.furthestPosition;
          game.moveTile(tile, endPosition);
          if (!game.comparePositions(position, endPosition)) {
            tileMoved = true;
          }
        }
      }
    })

    if (tileMoved) {
      game.addTile();
    }
  };

  Game.prototype.resetTileMerges = function () {
    for (var x = 0; x < this.grid.grid.length; x++) {
      for (var y = 0; y < this.grid.grid[x].length; y++) {
        if (this.grid.grid[x][y] !== null) {
          this.grid.grid[x][y].merged = false;
        }
      }
    }
  }

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
        obstacleFound = false,
        mergedPosition = null,
        furthestPos = null;

    do {
      if (this.validNextPosition({x: x + dX, y: y + dY}) &&
          this.grid.grid[x + dX][y + dY] !== null) {
        furthestPos = {x: x, y: y};
        mergedPosition = {x: x + dX, y: y + dY};
        obstacleFound = true;
      } else {
        furthestPos = {x: x, y: y};
        x = x + dX;
        y = y + dY;
      }
    } while (!obstacleFound && 
             this.validNextPosition({x: x, y: y}))

    // while (!obstacleFound && 
    //        this.validNextPosition({x: x + dX, y: y + dY})) {

    //   if (this.grid.grid[x + dX][y + dY] !== null) {
    //     mergedPosition = {x: x + dX, y: y + dY};
    //     obstacleFound = true;
    //   } else {
    //     x = x + dX;
    //     y = y + dY;
    //     furthestPos = {x: x, y: y};
    //   }
    // }

    return (
      {
        furthestPosition: furthestPos,
        mergePosition: mergedPosition
      }
    );
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
  };

  Game.prototype.positionOrder = function (direction) {
    var positions = [],
        grid = this.grid.grid;

    switch (direction) {
      // check all tiles on row this.grid.grid[0][] first
      case "left":
        for (var x = 0; x < grid.length; x++) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[x][y] !== null) {
              positions.push({x: x, y: y});
            } 
          }
        }
        break;

      // check all tiles on row this.grid.grid[size-1][] first
      case "right":
        for (var x = this.size - 1; x >= 0; x--) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[x][y] !== null) {
              positions.push({x: x, y: y});
            } 
          }
        }
        break;

      // check all tiles on col this.grid.grid[][size-1] first
      case "up":
        for (var x = this.size - 1; x >= 0; x--) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[y][x] !== null) {
              positions.push({x: y, y: x});
            } 
          }
        }
        break;

      // check all tiles on col this.grid.grid[][0] first
      case "down":
        for (var x = 0; x < grid.length; x++) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[y][x] !== null) {
              positions.push({x: y, y: x});
            } 
          }
        }
        break;
    }

    return positions;
  };

  Game.prototype.render = function() {
    var grid = this.grid.grid;

    for (var x = 0; x < grid.length; x++) {
      var row = document.getElementById("row-" + x);
      for (var y = 0; y < grid[x].length; y++) {
        if (grid[x][y] === null) {
          row.children[y].innerHTML = "&nbsp;";
        } else {
          row.children[y].innerHTML = "" + grid[x][y].value;
        }
      }
    }
  };
})(this);