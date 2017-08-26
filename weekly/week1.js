/* LOAD 1
  (start the file with this)
window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
};
*/

/* LOAD 2
  (paste before window.onload)
var PlayState = {};

  (paste into window.onload)
    game.state.add('play', PlayState);
    game.state.start('play');
  (end of paste into window.onload)

*/

/* LOAD 3
  (paste after window.onload)
PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
};

*/

/* LOAD 4
  (paste after PlayState.preload)
PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
};
*/

var PlayState = {};

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};

PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
};

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
};
