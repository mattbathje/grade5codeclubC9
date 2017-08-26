/* LOAD 1
  (paste into PlayState.preload, after images but before sounds)
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
*/

/* LOAD 2
  (paste into PlaySate._loadlevel, after the corresponding platform-related group/load)
    this.coins = this.game.add.group();
    
    data.coins.forEach(this._spawnCoin, this);
*/

/* LOAD 3
  (paste right after PlayState._spawnCharacters)
PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
    sprite.animations.play('rotate');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};
*/

/* LOAD 4
  (paste into PlayState._handlecollisions)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
*/

/* LOAD 5
  (paste at the bottom of the file)
PlayState._onHeroVsCoin = function (hero, coin) {
    coin.kill();
};
*/

/* LOAD 6
  (paste into PlayState.preload with the other sounds)
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
*/

/* LOAD 7
  (paste into PlayState.create in the sfx section, right after the jump line)
  MAKE SURE TO ADD A COMMA AFTER JUMP LINE!
    , coin: this.game.add.audio('sfx:coin')
*/

/* LOAD 8
  (paste at the beginning of PlayState._onHerovsCoin)
    this.sfx.coin.play();
*/

/* LOAD 9
  (paste into PlayState.preload with the other spritesheets)
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
*/

/* LOAD 10
  (paste after Hero object creation functions, right before var PlayState = {} line)
function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');
    this.anchor.set(0.5);
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}
Spider.SPEED = 100;
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;
*/

/* LOAD 11
  (paste into PlayState._loadlevel with other group creations)
    this.spiders = this.game.add.group();
*/

/* LOAD 12
  (paste into PlayState._loadlevel, as part of the function call to PlayState._spawnCharacters, 
  right next to hero: data.hero - before the closing }  )
    , spiders: data.spiders
*/

/* LOAD 13
  (paste into PlayState._spawnCharacters)
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);
*/

/* LOAD 14
 (paste into PlayState._handlecollisions)
    this.game.physics.arcade.collide(this.spiders, this.platforms);
 */

 /* LOAD 15
   (paste into PlayState.preload with other image creations)
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
*/

/* LOAD 16
  (paste into PlayState._loadlevel with other group creations)
    this.enemyWalls = this.game.add.group();
*/

/* LOAD 17
  (paste into PlayState._spawnPlatform)
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
*/

/* LOAD 18
  (paste right after PlayState._spawnCoin)
PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};
*/

/* LOAD 19
  (paste into PlayState._handleCollisions)
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
*/

/* LOAD 20
  (paste into PlayState._loadlevel after group creations)
    this.enemyWalls.visible = false;
*/

/* LOAD 21
  (paste right after spider object creation, right before var PlayState={} )
Spider.prototype.update = function () {
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED;
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED;
    }
};
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

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }
    return canJump;
};

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');
    this.anchor.set(0.5);
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}
Spider.SPEED = 100;
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED;
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED;
    }
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
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });
    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
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
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');

    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');

    this.game.load.json('level:1', 'data/level01.json');
};

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin')
    };

    this._loadLevel(this.game.cache.getJSON('level:1'));
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
};

PlayState._loadLevel = function (data) {
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();

    this.enemyWalls.visible = false;

    data.platforms.forEach(this._spawnPlatform, this);
    data.coins.forEach(this._spawnCoin, this);

    this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnCharacters = function (data) {
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);

    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
    sprite.animations.play('rotate');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
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

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
};