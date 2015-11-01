(function (root) {
  var SwipeListener = root.SwipeListener = function () {
    this.start = null;
    this.end = null;

    root.addEventListener("touchstart", 
      function (e) {
        var t = e.changedTouches[0]
        this.start = {x: t.clientX, y: t.clientY, time: Date.now() };
    }.bind(this), false);

    root.addEventListener("touchend", 
      function (e) {
        var t = e.changedTouches[0]
        this.end = {x: t.clientX, y: t.clientY, time: Date.now() };
        this.detectSwipe();
    }.bind(this), false);
  };

  SwipeListener.prototype.detectSwipe = function () {
    var horizontalMove = this.end.x - this.start.x,
        verticalMove = this.end.y - this.start.y,
        time = this.end.time - this.start.time;

    if (time < 150 && (Math.abs(horizontalMove) > 10 || Math.abs(verticalMove) > 10)) {
      this.findDirection({x: horizontalMove, y: verticalMove});
    } else {
    }
  };

  SwipeListener.prototype.findDirection = function (move) {
    if (move.x > 0 && Math.abs(move.y) < 50) {
      game.slide("up");
    } else if (move.x < 0 && Math.abs(move.y) < 50) {
      game.slide("down");
    } else if (move.y < 0) {
      game.slide("left");
    } else if (move.y > 0) {
      game.slide("right");
    }

    game.render();
  };
})(this);