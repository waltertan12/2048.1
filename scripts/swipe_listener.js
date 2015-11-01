(function (root) {
  var SwipeListener = root.SwipeListener = function () {
    this.start = null;
    this.end = null;

    root.addEventListener("touchstart", 
      function (e) {
        var t = e.touches[0]
        console.log(e);
        this.start = {x: t.clientX, y: t.clientY, time: Date.now() };
    }.bind(this), false);

    root.addEventListener("touchend", 
      function (e) {
        console.log(e);
        var t = e.touches[0]
        this.end = {x: t.clientX, y: t.clientY, time: Date.now() };
        this.detectSwipe();
    }.bind(this), false);
  };

  SwipeListener.prototype.detectSwipe = function () {
    var horizontalMove = this.end.x - this.start.x,
        verticalMove = this.end.y - this.start.y,
        time = this.end.time - this.start.time;

    if (time < 150 && (Math.abs(horizontalMove) > 10 || Math.abs(verticalMove) > 10)) {
      console.log("Swipe!");
      this.findDirection({x: horizontalMove, y: verticalMove});
    } else {
      console.log("No Swipe!");
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