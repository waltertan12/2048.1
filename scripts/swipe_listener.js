(function (root) {
  var SWIPE_THRESHOLD_TIME = 200;

  var SwipeListener = root.SwipeListener = function () {
    this.start = {x: 0, y: 0, time: Number.MAX_VALUE};
    this.end = {x: 0, y: 0, time: Number.MAX_VALUE};

    root.addEventListener("touchstart", 
      function (e) {
        var t = e.changedTouches[0]
        this.start = {x: t.clientX, y: t.clientY, time: Date.now() };
    }.bind(this), false);

    root.addEventListener("touchmove", function(e) {
      if (this.start.time - this.end.time < SWIPE_THRESHOLD_TIME) {
        e.preventDefault();
      }
    }.bind(this), false);

    root.addEventListener("touchend", 
      function (e) {
        var t = e.changedTouches[0]
        this.end = {x: t.clientX, y: t.clientY, time: Date.now() };
        this.detectSwipe(e);
    }.bind(this), false);
  };

  SwipeListener.prototype.reset = function () {
    this.start = {x: 0, y: 0, time: Number.MAX_VALUE};
    this.end = {x: 0, y: 0, time: Number.MAX_VALUE};
  };

  SwipeListener.prototype.detectSwipe = function (e) {
    var horizontalMove = this.end.x - this.start.x,
        verticalMove = this.end.y - this.start.y,
        time = this.end.time - this.start.time;

    if (time < SWIPE_THRESHOLD_TIME && (Math.abs(horizontalMove) > 10 || Math.abs(verticalMove) > 10)) {
      this.findDirection({x: horizontalMove, y: verticalMove});
      this.reset();
    }
  };

  SwipeListener.prototype.findDirection = function (move) {
    if (move.x > 0 && Math.abs(move.y) < 50) {
      console.log("Swipe right");
      game.slide("up");
    } else if (move.x < 0 && Math.abs(move.y) < 50) {
      console.log("Swipe left");
      game.slide("down");
    } else if (move.y < 0) {
      console.log("Swipe up");
      game.slide("left");
    } else if (move.y > 0) {
      console.log("Swipe down");
      game.slide("right");
    }

    game.render();
  };
})(this);