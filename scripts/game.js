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
      },
      SIZE = 4;

  var Game = root.Game = function () {
    this.size = SIZE;
    this.score = 0;
    this.over = false;
    this.won = false;
    this.grid = new Grid(SIZE);
    this.addTile();
    this.addTile();
  };

  Game.prototype.restart = function () {
    this.grid = new Grid(this.grid.size);
    this.addTile();
    this.addTile();
    this.score = 0;
    this.over = false;
    this.won = false;

    this.render();
  };

  Game.prototype.comparePositions = function(positionOne, positionTwo) {
    return (
      positionOne.x === positionTwo.x &&
      positionOne.y === positionTwo.y
    );
  };

  Game.prototype.addTile = function (grid) {
    if (typeof grid === "undefined") {
      grid = this.grid;
    }
    var position = grid.randomPosition();
    grid.addTile(position, _INITIAL_VALUE);
  };

  Game.prototype.slide = function (direction) {
    var positions = this.positionOrder(direction),
        grid = this.grid,
        game = this,
        tileMoved = false,
        tile, mergePosition, collisionTile;

    game.resetTileMerges();

    positions.forEach(function (position) {
      tile = grid.grid[position.x][position.y];
      collisionTile = null;

      // does the space still have a tile?
      if (tile !== null) {
        positions = game.furthestPosition(direction, tile);
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

          var mergedTile = new Tile(mergePosition, tile.value + tile.value);
          mergedTile.merged = true;
          mergedTile.previousPosition = position;

          if (tile.value + tile.value === 2048) {
            game.won = true;
          }

          grid.removeTile({x: tile.x, y: tile.y});
          grid.removeTile(mergePosition);
          grid.grid[mergePosition.x][mergePosition.y] = mergedTile;

          game.score = game.score + tile.value + tile.value;
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
    });

    if (tileMoved) {
      game.addTile();
    }
  };

  Game.prototype.isOver = function () {
    if (this.grid.availablePositions().length > 0) {
      return false;
    } else {
      return !this.mergeAvailable();
    }
  };

  Game.prototype.resetTileMerges = function (grid) {
    if (typeof grid === "undefined") {
      grid = this.grid.grid;
    }
    var size = grid.length;

    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        if (grid[x][y] !== null) {
          grid[x][y].merged = false;
        }
      }
    }

    // for (var x = 0, y = 0; 
    //      x < size && y < size;
    //      y++,
    //      x = (y === size) ? x + 1 : x,
    //      y = (y === size) ? y = 0 : y) {
    //   if (grid[x][y] !== null) {
    //     grid[x][y].merged = false;
    //   }
    // }
  };

  Game.prototype.moveTile = function (tile, newPosition, grid) {
    if (typeof grid === "undefined") {
      grid = this.grid.grid;
    }

    tile.previousPosition = tile.position;

    grid[tile.x][tile.y] = null;
    grid[newPosition.x][newPosition.y] = tile;

    tile.updatePosition(newPosition);
  };

  Game.prototype.validNextPosition = function (nextPosition) {
    return this.grid.validPosition(nextPosition);
  };

  Game.prototype.furthestPosition = function (direction, tile, grid) {
    if (typeof grid === "undefined") {
      grid = this.grid;
    }

    var x = tile.x,
        y = tile.y,
        dX = DIRECTIONS[direction].x,
        dY = DIRECTIONS[direction].y,
        obstacleFound = false,
        mergedPosition = null,
        furthestPos = null;

    do {
      if (this.validNextPosition({x: x + dX, y: y + dY}) &&
          grid.grid[x + dX][y + dY] !== null) {
        furthestPos = {x: x, y: y};
        mergedPosition = {x: x + dX, y: y + dY};
        obstacleFound = true;
      } else {
        furthestPos = {x: x, y: y};
        x = x + dX;
        y = y + dY;
      }
    } while (!obstacleFound && this.validNextPosition({x: x, y: y}));

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
        grid = this.grid.grid,
        size = grid.length;

    switch (direction) {
      // check all tiles on row this.grid.grid[0][] first
      case "left":
        for (var x = 0; x < size; x++) {
          for (var y = 0; y < size; y++) {
            if (grid[x][y] !== null) {
              positions.push({x: x, y: y});
            } 
          }
        }
        // for (var x = 0, y = 0; 
        //  x < size && y < size;
        //  y++,
        //  x = (y === size) ? x + 1 : x,
        //  y = (y === size) ? y = 0 : y) {
        //   if (grid[x][y] !== null) {
        //     positions.push({x: x, y: y});
        //   }
        // }
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
        // for (var x = size - 1, y = 0; 
        //  x >= 0 && y < size;
        //  y++,
        //  x = (y === size) ? x - 1 : x,
        //  y = (y === size) ? y = 0 : y) {
        //   if (grid[x][y] !== null) {
        //     positions.push({x: x, y: y});
        //   }
        // }
        break;

      // check all tiles on col this.grid.grid[][size-1] first
      case "up":
        // CHECK ON THIS ONE
        for (var x = this.size - 1; x >= 0; x--) {
          for (var y = 0; y < grid.length; y++) {
            if (grid[y][x] !== null) {
              positions.push({x: y, y: x});
            } 
          }
        }
        // for (var x = size - 1, y = 0; 
        //  x >= 0 && y < size;
        //  y++,
        //  x = (y === size) ? x - 1 : x,
        //  y = (y === size) ? y = 0 : y) {
        //   if (grid[y][x] !== null) {
        //     positions.push({x: y, y: x});
        //   }
        // }
        break;

      // check all tiles on col this.grid.grid[][0] first
      case "down":
        for (var x = 0; x < size; x++) {
          for (var y = 0; y < size; y++) {
            if (grid[y][x] !== null) {
              positions.push({x: y, y: x});
            } 
          }
        }
        // for (var x = 0, y = 0; 
        //  x < size && y < size;
        //  y++,
        //  x = (y === size) ? x + 1 : x,
        //  y = (y === size) ? y = 0 : y) {
        //   if (grid[y][x] !== null) {
        //     positions.push({x: y, y: x});
        //   }
        // }
        break;
    }

    return positions;
  };

  Game.prototype.mergeAvailable = function () {
    var grid = this.grid.grid,
        size = grid.length,
        directions = ["up", "down", "left", "right"],
        tile;

    for (var x = 0; x < size; x ++) {
      for (var y = 0; y < size; y++) {
        var tile = grid[x][y];

        if (tile !== null) {
          for (var i = 0; i < directions.length; i++) {
            var dX = DIRECTIONS[directions[i]].x;
            var dY = DIRECTIONS[directions[i]].y;
            var position = { x: tile.x + dX, y: tile.y + dY };
            var otherTile = null;

            if (this.validNextPosition(position)) {
              otherTile = grid[position.x][position.y];
            }

            if (otherTile !== null && tile.isMatch(otherTile)) {
              return true;
            }
          }
        }
      }
    }

    // for (var x = 0, y = 0; 
    //      x < size && y < size;
    //      y++,
    //      x = (y === size) ? x + 1 : x,
    //      y = (y === size) ? y = 0 : y) {
      
    //   tile = grid[x][y];

    //   if (tile !== null) {
    //     for (var i = 0; i < directions.length; i++) {
    //       var dX = DIRECTIONS[directions[i]].x;
    //       var dY = DIRECTIONS[directions[i]].y;
    //       var position = { x: tile.x + dX, y: tile.y + dY };
    //       var otherTile = null;

    //       if (this.validNextPosition(position)) {
    //         otherTile = grid[position.x][position.y];
    //       }

    //       if (otherTile !== null && tile.isMatch(otherTile)) {
    //         return true;
    //       }
    //     }
    //   }
    // }
    return false;
  };

  Game.prototype.render = function() {
    var game = this,
        grid = this.grid.grid,
        size = grid.length,
        score = document.getElementById("score"),
        row, className;

    for (var x = 0; x < size; x ++) {
      for (var y = 0; y < size; y++) {
        if (y === 0) {
          row = document.getElementById("row-" + x);
        }



        if (grid[x][y] === null) {
          row.children[y].innerHTML = "&nbsp;";
          row.children[y].className = "tile tile-new low-z tile-" + x +"-" + y;
        } else {
          className = game.classGenerator(grid[x][y].value);
          if (grid[x][y].previousPosition !== null) {
            row.children[y].className = "tile tile-" + 
                                        grid[x][y].previousPosition.x +
                                        "-" +
                                        grid[x][y].previousPosition.y + 
                                        " " +
                                        className + " transition";
          } else if (grid[x][y].merged) {
            row.children[y].className = "tile tile-merged tile-" + x +"-" + y + " " + className + " transition";
          }

          (function (row, x, y) {
            setTimeout( function () {
              if (grid[x][y] !== null) {
                className = game.classGenerator(grid[x][y].value);
                row.children[y].innerHTML = "<p>" + 
                                            grid[x][y].value + 
                                            "</p>";
                row.children[y].className = "tile tile-" + 
                                            x +"-" + y + " " + 
                                            className;
              } else {
                row.children[y].className = "tile tile-new tile-" + x +"-" + y + " " + className; 
              }
            }, 100);
          })(row, x, y);

        }

      }
    }

    score.innerHTML = "<h1>Score: " + this.score+ "</h1>";
    var gameMessage = document.getElementById("game-message") ;

    if (this.won) {
      gameMessage.innerHTML = "<h1>You win :)</h1><button class='btn btn-primary' onClick='game.restart()'>Restart</button><br><br>";
      gameMessage.className = "show-messages"
    } else if (this.isOver()){
      this.over = true;
      gameMessage.innerHTML = "<h1>You lose :(</h1><button class='btn btn-primary' onClick='game.restart()'>Restart</button><br><br>";
      gameMessage.className = "show-messages"
    } 
    else {
      gameMessage.innerHTML = "";
      gameMessage.className = "hide-messages"
    }
  };

  Game.prototype.setNewClasses = function (grid, x, y) {
    setTimeout( function () {
      var className = game.classGenerator(grid[x][y].value);
      row.children[y].innerHTML = "<p>" + grid[x][y].value + "</p>";
      row.children[y].className = "tile tile-" + 
                                  x +"-" + y + " " + 
                                  className;
    }, 100);
  };

  Game.prototype.classGenerator = function (value) {
    switch (value) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 4:
        return "four";
      case 8:
        return "eight";
      case 16:
        return "sixteen";
      case 32:
        return "one";
      case 64:
        return "two";
      case 128:
        return "four";
      case 256:
        return "eight";
      case 512:
        return "sixteen";
      case 1024:
        return "one";
      case 2048:
        return "two";
      case 4096:
        return "four";
      case 8192:
        return "eight";
      case 16384:
        return "sixteen";
    }
  };

  Game.prototype.slideAI = function (inputGrid, direction) {
    var positions = this.positionOrder(direction),
        grid = new Grid(inputGrid.size, inputGrid),
        game = this,
        tileMoved = false,
        tile, mergePosition, collisionTile;

    game.resetTileMerges(grid);

    positions.forEach(function (position) {
      tile = grid.grid[position.x][position.y];
      collisionTile = null;

      // does the space still have a tile?
      if (tile !== null) {
        positions = game.furthestPosition(direction, tile, grid);
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

          var mergedTile = new Tile(mergePosition, tile.value + tile.value);
          mergedTile.merged = true;

          if (tile.value + tile.value === 2048) {
            game.won = true;
          }

          grid.removeTile({x: tile.x, y: tile.y});
          grid.removeTile(mergePosition);
          grid.grid[mergePosition.x][mergePosition.y] = mergedTile;

          // game.score = game.score + tile.value + tile.value;
          tileMoved = true;

        // no merge
        } else {
          var endPosition = positions.furthestPosition;
          game.moveTile(tile, endPosition, grid.grid);
          if (!game.comparePositions(position, endPosition)) {
            tileMoved = true;
          }
        }
      }
    });

    return [grid, tileMoved];
  };
})(this);