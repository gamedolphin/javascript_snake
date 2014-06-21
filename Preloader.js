
BasicGame.Preloader = function (game) {

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//set up the loading sprites
		this.background = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
		this.background.anchor.setTo(0.5,0.5);
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0,0.5);
		this.preloadBar.x = this.world.centerX - this.preloadBar.width*0.5;

		this.load.setPreloadSprite(this.preloadBar);

		//all the game sprites have been combined into a single image
		this.load.atlas('spriteSet', 'assets/spriteSet.png', 'assets/spriteSet.jsona');
		//load game font
		this.load.bitmapFont('olijo', 'assets/font/font.png', 'assets/font/font.fnt');
		//load game sounds
		this.load.audio('eat',['assets/sounds/eat.mp3','assets/sounds/eat.ogg','assets/sounds/eat.wav','assets/sounds/eat.m4a']);

	},

	create: function () {

		this.preloadBar.cropEnabled = false;

	},

	update: function () {
		if(this.cache.isSoundDecoded('eat')){
			this.state.start('MainMenu');
		}
	}

};
