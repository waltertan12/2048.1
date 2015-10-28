(function (root) {
  "use strict";

  root.onkeyup = function (e) {
    console.log(e);
    switch (e.keyCode) {
      // left arrow
      case 37:
        game.slide("down");
        break;
      // up arrow
      case 38:
        game.slide("left");

        break;
      // right arrow
      case 39:
        game.slide("up");

        break;
      // down arrow
      case 40:
        game.slide("right");

        break;
    }
    game.render();
  };
})(this);