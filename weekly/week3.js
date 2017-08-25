/* LOAD 1
  (paste at end of Hero constructor)
    this.game.physics.enable(this);
*/

/* LOAD 2
  (paste right after Hero.prototype.constructor = Hero)
Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
};
*/

/* LOAD 3
  (paste right before PlayState.preload)
PlayState.init = function (data) {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT
    });
};
*/

/* LOAD 4
  (paste right after PlayState.create)
PlayState.update = function () {
    this._handleInput();
};
*/

/* LOAD 5
  (paste at bottom of file)
PlayState._handleInput = function () {
    if (this.keys.left.isDown) {
        this.hero.move(-1);
    } else if (this.keys.right.isDown) {
        this.hero.move(1);
    } else {
        this.hero.move(0);
    }
};
*/

/* LOAD 6
  (paste at end of Hero constructor)
    this.body.collideWorldBounds = true;
*/
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
};

var PlayState = {};

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};

PlayState.init = function (data) {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT
    });
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

PlayState.update = function () {
    this._handleInput();
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

PlayState._handleInput = function () {
    if (this.keys.left.isDown) {
        this.hero.move(-1);
    } else if (this.keys.right.isDown) {
        this.hero.move(1);
    } else {
        this.hero.move(0);
    }
};