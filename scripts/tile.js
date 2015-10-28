(function (root) {
  "use strict";
  
  var Tile = root.Tile = function (position, value) {
    this.position = position;
    this.x = position.x;
    this.y = position.y;

    this.value = value;
    this.merged = false;
  };

  Tile.prototype.setValue = function(newValue) {
    this.value = newValue;
  };

  Tile.prototype.isMatch = function (otherTile) {
    return this.value === otherTile.value;
  };

  Tile.prototype.updatePosition = function (position) {
    this.position = position;
    this.x = position.x;
    this.y = position.y;
  };
})(this);