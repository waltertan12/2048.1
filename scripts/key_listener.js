(function (root) {
  "use strict";

  // Prevent screen from sliding on arrow key press
  root.addEventListener("keydown", function(e){
      switch(e.keyCode){
          case 37: case 39: case 38:  case 40: // Arrow keys
          case 32: e.preventDefault(); break; // Space
          default: break; // do not block other keys
      }
  }, false);

  root.onkeyup = function (e) {
    var keyCode = e.keyCode;
    switch (keyCode) {
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