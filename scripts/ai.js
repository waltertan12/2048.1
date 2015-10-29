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

  AI.prototype.permute = function (grid, depth) {
    var best = [Number.MIN_VALUE, "left"];
    if (depth <= 0) {
      return this.scoring(grid);
    }
    // if (option === "Use Grid Options") {
    //   var options = this.buildGridOptions(grid);

    //   for (var i = 0; i < options.length; i++) {
    //     var nextGrid = options[i];
    //     var scoreAndDirection = this.permute(nextGrid, depth - 1, option);
    //     if (best[0] < scoreAndDirection[0]) {
    //       best[0] = scoreAndDirection[0];
    //       best[1] = scoreAndDirection[1];
    //     }
    //   }

    //   return best;
    // }
    // if (option === "Use SlideAI") {
      var directions = ["up", "down", "left", "right"];

      for (var i = 0; i < directions.length; i++) {
        var newGridState = this.game.slideAI(grid, directions[i]);
        var newGrid = newGridState[0];
        var tileMoved = newGridState[1];
        if (!tileMoved) { continue; }
        
        var scoreAndDirection = this.permute(newGrid, depth - 1);
        var maximum = scoreAndDirection[0];

        console.log("score and direction");
        console.log(scoreAndDirection);

        if (maximum >= best[0]) {
          best = [maximum, directions[i]];
        }
      }
      return best;
    // }
  };

  AI.prototype.getNextMove = function(grid, depth) {
    var move = this.permute(grid, depth);
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

  AI.prototype.iterate = function () {
    var newGrid = new Grid(this.game.grid.size, this.game.grid);
    var nextMove = this.getNextMove(newGrid, 4);
    this.game.slide(nextMove);
    this.game.render();
  };

  AI.prototype.run = function () {
    setInterval(function () {
      this.iterate();
    }.bind(this), this.interval)
  }
})(this);