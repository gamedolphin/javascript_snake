var BasicGame = {
    //global variables

    timerDelay : 400,   //snake movement delay

    score : 0,          //current score

    highscore : null,   //object to store highscores

    currentMode : 'E',  //current play mode - easy/medium/hard

    trailno : 6,        //length of the trailing snake effect

    textList : null   //object to hold parsed game text
};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/preloadbck.png');
        this.load.image('preloaderBar', 'assets/preloadbar.png');
        //load all game text from text file to make localization in different games easy
        this.load.text('textList','assets/BasicGame.txt');

        //Load the local highscores from the localStorage and if they don't exist (first play) then create them
        var tempString = localStorage.getItem("HS");
        if(tempString!=null){
            //parse cannot handle null
            BasicGame.highscore = JSON.parse(tempString);
        }
        else{
            BasicGame.highscore = {
                E : 0,
                M : 0,
                H : 0
            };
        }

    },

    create: function () {

        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 240;
            this.scale.minHeight = 400;
            this.scale.maxWidth = 600;
            this.scale.maxHeight = 1000;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 240;
            this.scale.minHeight = 400;
            this.scale.maxWidth = 600;
            this.scale.maxHeight = 1000;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }
        this.scale.setScreenSize(true);
        //parse the game text into the textList object;
        var jsonData = JSON.parse(this.game.cache.getText('textList'));
        BasicGame.textList = jsonData;

        //start the preloader
        this.state.start('Preloader');

    }

};
