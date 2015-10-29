(function (root) {
  "use strict";

  var DIRECTIONS = {
    "left":  {x: -1, y:  0},
    "right": {x:  1, y:  0},
    "up":    {x:  0, y:  1},
    "down":  {x:  0, y: -1}
  };

  var AI = root.AI = function(game, interval) {
    if (typeof interval === "undefined") {
      interval = 500;
    }
    this.game = game;
    this.interval = 500;
  };

  // Minimax
  AI.prototype.permute = function (grid, depth, maxPlayer, min, max) {
    var bestMove = [0, "left"];
    if (depth <= 0) {
      return this.scoring(grid);
    }
    var directions = ["up", "down", "left", "right"];
    switch (maxPlayer) {
      case true:
        for (var i = 0; i < directions.length; i++) {
          var newGridState = this.game.slideAI(grid, directions[i]);
          var newGrid = newGridState[0];
          var tileMoved = newGridState[1];

          if (!tileMoved) { continue; }

          var scoreAndDirection = this.permute(
            newGrid, 
            depth - 1, 
            false, 
            min, 
            max
          );

          max = scoreAndDirection[0];

          if (max < min) {
            return bestMove;
          }

          if (max >= bestMove[0]) {
            bestMove = [max, directions[i]];
          }
        }
        return bestMove;

      case false:
        var options = this.buildGridOptions(grid);

        for (var i = 0; i < options.length; i++) {
          var nextGrid = options[i];
          var scoreAndDirection = this.permute( nextGrid, 
                                                depth - 1,
                                                true,
                                                min,
                                                max );

          min = scoreAndDirection[0];

          if (max < min) {
            return bestMove;
          }

          bestMove[0] = bestMove[0] + min;
        }
        return bestMove;
    }
  };

  // Expectimax
  AI.prototype.permuteV2 = function (grid, depth, maxPlayer) {
    var bestMove = [0, "left"];

    if (depth <= 0) {
      return this.scoring(grid);
    }
    
    switch (maxPlayer) {
      case true:
        var directions = ["up", "down", "left", "right"];

        for (var i = 0; i < directions.length; i++) {
          var newGridState = this.game.slideAI(grid, directions[i]);
          var newGrid = newGridState[0];
          var tileMoved = newGridState[1];

          if (!tileMoved) { continue; }

          var scoreAndDirection = this.permuteV2( newGrid, 
                                                  depth - 1, 
                                                  false );

          if (scoreAndDirection[0] >= bestMove[0]) {
            bestMove = [scoreAndDirection[0], directions[i]];
          }
        }
        return bestMove;

      // Return average of each child node
      case false:

        var options = this.buildGridOptions(grid);
        var numMovesAvailable = grid.availablePositions().length;

        for (var i = 0; i < options.length; i++) {
          var nextGrid = options[i];
          var scoreAndDirection = this.permuteV2( nextGrid, 
                                                  depth - 1,
                                                  true);

          bestMove[0] = bestMove[0] + 
                        (scoreAndDirection[0] * (1 / numMovesAvailable));
        }
        return bestMove;
    }
  };

  AI.prototype.getNextMove = function(grid, depth, option) {
    var move;

    switch (option) {
      case 1:
        move = this.permute(grid, depth, true, Number.MIN_VALUE, Number.MAX_VALUE);
        break;
      case 2:
        move = this.permuteV2(grid, depth, true);
        break;
    }

    return move[1];
  };

  AI.prototype.buildGridOptions = function (grid) {
    var options = [];
    var availablePositions = grid.availablePositions();

    for (var i = 0; i < availablePositions.length; i++) {
      var newGrid = new Grid (grid.size, grid);
      newGrid.addTile(availablePositions[i], 1);
      options.push(newGrid);
    }

    return options;
  };

  AI.prototype.scoring = function (grid) {
    var distribution = {
      "left": [
        [ 3,  2,  1,  0],
        [ 2,  1,  0, -1],
        [ 1,  0, -1, -2],
        [ 0, -1, -2, -3]
      ],
      "up": [
        [ 0,  1,  2,  3],
        [-1,  0,  1,  2],
        [-2, -1,  0,  1],
        [-3, -2, -1,  0]
      ],
      "right": [
        [-3, -2, -1,  0],
        [-2, -1,  0,  1],
        [-1,  0,  1,  2],
        [ 0,  1,  2,  3]
      ],
      "down": [
        [ 0, -1, -2, -3],
        [ 1,  0, -1, -2],
        [ 2,  1,  0, -1],
        [ 3,  2,  1,  0]
      ],
    };

    var directions = ["left", "up", "right", "down"];
    var values = {
      "left": 0,
      "up": 0,
      "right": 0,
      "down": 0
    };


    for (var i = 0; i < directions.length; i++) {
      var direction = directions[i];
      grid.each(function (x, y, tile) {
        if (tile !== null && typeof tile.value === "number") {
          var score = distribution[direction][x][y] * tile.value;
          values[direction] = values[direction] + parseInt(score);
        }
      });
    }

    var maxScore = Math.max.apply(
      Math,
      [
       values["left"], 
       values["up"], 
       values["right"], 
       values["down"]
      ]
    );

    var direction;
    if (values["left"] === maxScore) {
      direction = "left";
    } else if (values["up"] === maxScore) {
      direction = "up";
    } else if (values["right"] === maxScore) {
      direction = "right";
    } else {
      direction = "down";
    }

    return [maxScore, direction];
  };

  AI.prototype.iterate = function (depth, option) {
    var nextMove = this.getNextMove(this.game.grid, depth, option);
    this.game.slide(nextMove);
    this.game.render();
  };

  AI.prototype.run = function (depth, option) {
    setInterval(function () {
      this.iterate(depth, option);
    }.bind(this), this.interval)
  }
})(this);