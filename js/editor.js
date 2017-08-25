
// the boundary where objects are allowed to be dragged
const BOUNDS = new Phaser.Rectangle(0,45,960,500);

const instructions = "Double click an icon in the black bar to add it to the game.\nDrag game objects around to move them.\nDouble click a game object to remove it from the game."
const saveInstructions = "Click the Save icon to copy the level to your clipboard.\nPaste it into a new .json file in the /data/ directory.\nThen edit main.js, load the .json file in PlayState.Preload, and increase the size of LEVEL_COUNT by 1."

function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = true;
    this.body.collideWorldBounds = true;
}
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');
    this.anchor.set(0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = true;
    this.body.collideWorldBounds = true;
}

Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

var PlayState = {};

PlayState.preload = function () {
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('font:numbers', 'images/numbers.png');
    this.game.load.image('key', 'images/key.png');
    this.game.load.image('icon:save', 'images/saveicon.png');
    
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    
    // only load the "empty" level editor level
    this.game.load.json('level:0', 'data/levelEditor.json');
};

PlayState.create = function () {
    /* Create a graphic so you can see the bounds if you want to see this, 
        comment out the background image load below (or move this to after
        the background load) */
    var graphics = this.game.add.graphics(BOUNDS.x, BOUNDS.y);
    graphics.beginFill(0x000077);
    graphics.drawRect(0, 0, BOUNDS.width, BOUNDS.height);
    
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON(`level:0`));
    this._createHud();
    this._createEditor();
};

PlayState.init = function (data) {
    this.level = 0;
    this.game.renderer.renderSession.roundPixels = true;
};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.door, this.platforms);
};

PlayState.update = function () {
    this._handleCollisions();
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    if(platform.image != 'ground') {
        // allow any platforms except for the ground to be dragged or removed
        sprite.inputEnabled = true;
        sprite.input.enableDrag(true);
        sprite.input.boundsRect = BOUNDS;
        sprite.events.onInputDown.add(this._removeListener, this);
    }
};

PlayState._spawnCharacters = function (data) {
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
    this.hero.inputEnabled = true;
    this.hero.input.enableDrag(true);
    this.hero.input.boundsRect = BOUNDS;
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
        sprite.inputEnabled = true;
        sprite.input.enableDrag(true);
        sprite.input.boundsRect = BOUNDS;
        sprite.events.onInputDown.add(this._removeListener, this);
    }, this);
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.inputEnabled = true;
    sprite.input.enableDrag(true);
    sprite.body.allowGravity = false;
    sprite.input.boundsRect = BOUNDS;
    sprite.events.onInputDown.add(this._removeListener, this);
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.inputEnabled = true;
    this.door.input.enableDrag(true);
    this.door.input.boundsRect = BOUNDS;
    this.door.body.allowGravity = true;
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.key);
    this.key.inputEnabled = true;
    this.key.input.enableDrag(true);
    this.key.input.boundsRect = BOUNDS;
    this.key.body.allowGravity = false;

};

PlayState._createHud = function () {
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    this.hud = this.game.add.group();
    this.hud.position.set(10, 10);
    this.hud.add(coinIcon);
    this.hud.add(this.keyIcon);
};

PlayState._createEditor = function() {
        this.ed = this.game.add.group();
        this.ed.position.set(0,600);
        
        let saveicon = this.game.make.image(5,40, 'icon:save');
        saveicon.inputEnabled = true;
        saveicon.events.onInputDown.add(this._saveListener, this);
        
        // loading platforms into the edit area could be more efficient...
        let grass81icon = this.game.make.image(115, 40, 'grass:8x1');
        grass81icon.scale.setTo(0.5,0.5);
        grass81icon.inputEnabled = true;
        grass81icon.events.onInputDown.add(this._addPlatformListener, this);
        
        let grass61icon = this.game.make.image(115, 70, 'grass:6x1');
        grass61icon.scale.setTo(0.5,0.5);
        grass61icon.inputEnabled = true;
        grass61icon.events.onInputDown.add(this._addPlatformListener, this);
        
        let grass11icon = this.game.make.image(260, 70, 'grass:1x1');
        grass11icon.scale.setTo(0.5,0.5);
        grass11icon.inputEnabled = true;
        grass11icon.events.onInputDown.add(this._addPlatformListener, this);
        
        let grass41icon = this.game.make.image(290, 40, 'grass:4x1');
        grass41icon.scale.setTo(0.5,0.5);
        grass41icon.inputEnabled = true;
        grass41icon.events.onInputDown.add(this._addPlatformListener, this);
        
        let grass21icon = this.game.make.image(290, 70, 'grass:2x1');
        grass21icon.scale.setTo(0.5,0.5);
        grass21icon.inputEnabled = true;
        grass21icon.events.onInputDown.add(this._addPlatformListener, this);
        
        let coinicon = this.game.make.image(390, 40, 'coin');
        coinicon.inputEnabled = true;
        coinicon.events.onInputDown.add(this._addCoinListener, this);
        
        let spidericon = this.game.make.image(390, 70, 'spider');
        spidericon.scale.setTo(0.75,0.75);
        spidericon.inputEnabled = true;
        spidericon.events.onInputDown.add(this._addSpiderListener, this);

        this.ed.add(saveicon);
        this.ed.add(grass81icon);
        this.ed.add(grass61icon);
        this.ed.add(grass11icon);
        this.ed.add(grass41icon);
        this.ed.add(grass21icon);
        this.ed.add(coinicon);
        this.ed.add(spidericon);
        
        var instructionTextStyle = { font: "14px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
        var textInstructions = this.game.add.text(0, 0, instructions, instructionTextStyle);
        textInstructions.setTextBounds(450, 600, 400, 130);
        var textSave = this.game.add.text(0,0, saveInstructions, instructionTextStyle);
        textSave.setTextBounds(20, 500, 800, 200);
};

PlayState._addPlatformListener = function(sprite, pointer) {
    // only process if its a double-click
    if (pointer.msSinceLastClick < this.game.input.doubleTapRate) {
        var platformObj = new Object();
        platformObj.x = 200;
        platformObj.y = 200;
        platformObj.image = sprite.key;
        let newSprite = this.platforms.create(platformObj.x, platformObj.y, platformObj.image);
        this.game.physics.enable(newSprite);
        newSprite.body.allowGravity = false;
        newSprite.body.immovable = true;
        newSprite.inputEnabled = true;
        newSprite.input.enableDrag(true);
        newSprite.input.boundsRect = BOUNDS;
        newSprite.events.onInputDown.add(this._removeListener, this);
    }
};

PlayState._addCoinListener = function(sprite, pointer) {
    if (pointer.msSinceLastClick < this.game.input.doubleTapRate) {
        let newSprite = this.coins.create(200, 200, 'coin');
        newSprite.anchor.set(0.5, 0.5);
        this.game.physics.enable(newSprite);
        newSprite.inputEnabled = true;
        newSprite.input.enableDrag(true);
        newSprite.body.allowGravity = false;
        newSprite.input.boundsRect = BOUNDS;
        newSprite.events.onInputDown.add(this._removeListener, this);
    }
};

PlayState._addSpiderListener = function(sprite, pointer) {
    if (pointer.msSinceLastClick < this.game.input.doubleTapRate) {
        let newSprite = new Spider(this.game, 200, 200);
        this.spiders.add(newSprite);
        newSprite.inputEnabled = true;
        newSprite.input.enableDrag(true);
        newSprite.input.boundsRect = BOUNDS;
        newSprite.events.onInputDown.add(this._removeListener, this);
    }
};

PlayState._removeListener = function(sprite, pointer) {
    if (pointer.msSinceLastClick < this.game.input.doubleTapRate) {
        sprite.destroy();
    }
};

PlayState._saveListener = function() {
    var fulljson = new Object();
    /* this is probable the stupid way of doing this, but it was the easiest
       way I could figure out in a short time to get the data filtered the way
       it was needed and also added to the json object array properly */
    fulljson.platforms = JSON.parse(JSON.stringify(this.platforms.children, ['key', 'x', 'y']).replace(/key/gi, "image"));
    fulljson.coins = JSON.parse(JSON.stringify(this.coins.children, ['x', 'y']));
    fulljson.spiders = JSON.parse(JSON.stringify(this.spiders.children, ['x', 'y']));
    fulljson.hero = JSON.parse(JSON.stringify(this.hero, ['x', 'y']));
    fulljson.door = JSON.parse(JSON.stringify(this.door, ['x', 'y']));
    fulljson.key = JSON.parse(JSON.stringify(this.key, ['x', 'y']));
    
    fulljson = JSON.stringify(fulljson);

    // the copy/paste code; only works in newer browsers
    document.getElementById('copyArea').value = fulljson;
    var textCopyArea = document.querySelector('textarea');
    textCopyArea.select();
    var copyRange = document.createRange();
    copyRange.selectNode(textCopyArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(copyRange);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
};

PlayState._loadLevel = function (data) {
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.bgDecoration = this.game.add.group();
    
    data.platforms.forEach(this._spawnPlatform, this);
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    data.coins.forEach(this._spawnCoin, this);
    this._spawnDoor(data.door.x, data.door.y);
    this._spawnKey(data.key.x, data.key.y);
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

window.onload = function () {
    let game = new Phaser.Game(960, 700, Phaser.AUTO, 'game');
    
    game.state.add('play', PlayState);
    game.state.start('play', true, false, {level: 0});
};

