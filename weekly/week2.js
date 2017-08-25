/* LOAD 1
  (paste into PlayState.preload)
    this.game.load.json('level:1', 'data/level01.json');
*/

/* LOAD 2
  (paste into PlayState.create)
    this._loadLevel(this.game.cache.getJSON('level:1'));
*/

/* LOAD 3
  (paste at bottom of file)
PlayState._loadLevel = function (data) {
};
*/

/* LOAD 4
  (paste into preload with the other image loads)
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
*/

/* LOAD 5
  (paste into PlayState._loadLevel)
    data.platforms.forEach(this._spawnPlatform, this);
*/

/* LOAD 6
  (paste at bottom of file)
PlayState._spawnPlatform = function (platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
};
*/

/* LOAD 7
    (paste into PlayState.preload with other images)
    this.game.load.image('hero', 'images/hero_stopped.png');
*/

/* LOAD 8
  (paste at top of file)
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
}
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
*/

/* LOAD 9
  (paste into PlayState._loadLevel)
    this._spawnCharacters({hero: data.hero});
*/

/* LOAD 10
  (paste after PlayState._spawnPlatform)
PlayState._spawnCharacters = function (data) {
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};
*/

function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
}
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

var PlayState = {};

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};

PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('hero', 'images/hero_stopped.png');

    this.game.load.json('level:1', 'data/level01.json');
};

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');

    this._loadLevel(this.game.cache.getJSON('level:1'));
};

PlayState._loadLevel = function (data) {
    data.platforms.forEach(this._spawnPlatform, this);
    this._spawnCharacters({hero: data.hero});
};

PlayState._spawnPlatform = function (platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
};

PlayState._spawnCharacters = function (data) {
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};