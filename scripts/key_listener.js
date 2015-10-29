(function (root) {
  "use strict";

  root.onkeyup = function (e) {
    switch (e.keyCode) {
      // left arrow
      case 37:
        browserGame.slide("down");
        break;
      // up arrow
      case 38:
        browserGame.slide("left");

        break;
      // right arrow
      case 39:
        browserGame.slide("up");

        break;
      // down arrow
      case 40:
        browserGame.slide("right");

        break;
    }
    browserGame.render();
  };
})(this);