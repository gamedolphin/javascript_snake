
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//stateGroup contains all the visible elements of the state - makes tweening easier on state change
		this.stateGroup = this.add.group();

		//initialize a 3 unit length snake
		this.initSnake(3);
		//and create a cache of 10 snake trail sprites
		this.initSnakeTrail(10);

		this.titleSprite = this.add.sprite(this.world.centerX,this.world.centerY-100,'spriteSet','title');
		this.titleSprite.anchor.setTo(0.5,0.5);

		this.playButton = this.add.bitmapText(this.world.centerX,this.world.centerY,'olijo',BasicGame.textList.play,36);
		this.playButton.x = this.world.centerX - this.playButton.textWidth*0.5;
		this.playButton.inputEnabled = true;
		this.playButton.events.onInputDown.add(this.showOptions,this);

		this.instructionsText = this.add.bitmapText(this.world.centerX,this.world.centerY+100,'olijo',BasicGame.textList.instructions,24);
		this.instructionsText.align = 'center';
		this.instructionsText.x = this.world.centerX - this.instructionsText.textWidth*0.5;

		//again, combining sprites that tween together into a group
		this.optionsGroup = this.add.group();
		this.option1 = this.add.bitmapText(this.world.centerX,this.world.centerY + 100,'olijo',BasicGame.textList.easy,28);
		this.option1.x = this.world.centerX - this.option1.textWidth*0.5;
		this.option1.inputEnabled = true;
		this.option1.events.onInputDown.add(this.startGame,this);
		this.option2 = this.add.bitmapText(this.world.centerX,this.world.centerY + 190,'olijo',BasicGame.textList.medium,28);
		this.option2.x = this.world.centerX - this.option2.textWidth*0.5;
		this.option2.inputEnabled = true;
		this.option2.events.onInputDown.add(this.startGame,this);
		this.option3 = this.add.bitmapText(this.world.centerX,this.world.centerY + 280,'olijo',BasicGame.textList.hard,28);
		this.option3.x = this.world.centerX - this.option3.textWidth*0.5;
		this.option3.inputEnabled = true;
		this.option3.events.onInputDown.add(this.startGame,this);
		this.optionsGroup.add(this.option1);
		this.optionsGroup.add(this.option2);
		this.optionsGroup.add(this.option3);

		this.optionsGroup.y += 300;

		this.addToStateGroup();

		this.add.tween(this.stateGroup).from({x:-500},500,Phaser.Easing.Sinusoidal.InOut,true);
	},

	addToStateGroup : function(){
		//put all elements of the state into a single group

		for(var i=0;i<this.snake.length;i++){
            this.stateGroup.add(this.snake[i]);
        }
        this.stateGroup.add(this.snakeTrail);
		this.stateGroup.add(this.titleSprite);
		this.stateGroup.add(this.playButton);
		this.stateGroup.add(this.instructionsText);
		this.stateGroup.add(this.optionsGroup);
	},

	showOptions : function(){
		//slide the options up
		this.add.tween(this.optionsGroup).to({y:'-380'},1000,Phaser.Easing.Sinusoidal.InOut,true);
		this.add.tween(this.instructionsText).to({alpha:0},800,Phaser.Easing.Sinusoidal.InOut,true);
		this.add.tween(this.playButton).to({alpha:0},800,Phaser.Easing.Sinusoidal.InOut,true);

		this.playButton.inputEnabled = false;
	},

	moveSnake : function(){

		//just code that makes the snake move randomly
		
		if(this.snakeDirection==0||this.snakeDirection==1){
			this.newSnakeDirection = this.rnd.integerInRange(2,3);
		}
		else{
			this.newSnakeDirection = this.rnd.integerInRange(0,1);
		}
		if(this.math.chanceRoll(15)){   //15 percent chance that the snake will change direction
			this.snakeDirection = this.newSnakeDirection;
		}

		var length = this.snake.length;

		switch(this.snakeDirection){
            case 0    :     this.snake[length-1].y = this.snake[0].y - 15;
                            this.snake[length-1].x = this.snake[0].x;
                            break;
            case 1  :      	this.snake[length-1].y = this.snake[0].y + 15;
                            this.snake[length-1].x = this.snake[0].x;
                            break;
            case 2  :      	this.snake[length-1].x = this.snake[0].x - 15;
                            this.snake[length-1].y = this.snake[0].y;
                            break;
            case 3 :      	this.snake[length-1].x = this.snake[0].x + 15;
                            this.snake[length-1].y = this.snake[0].y;
                            break; 
        }
        
        if(this.snake[length-1].x>this.world.width-14){
            this.snake[length-1].x = 0;
        }
        if(this.snake[length-1].x<0){
            this.snake[length-1].x = this.world.width-16;
        }
        if(this.snake[length-1].y>this.world.height-14){
            this.snake[length-1].y = 0;
        }
        if(this.snake[length-1].y<0){
            this.snake[length-1].y = this.world.height-16;
        }

        temp = this.snake.pop();
        this.snake.unshift(temp);

        this.leaveTrail(150,6); 

	},


    leaveTrail : function(t,n){
    	//simply puts a sprite at the end of the snake that gradually fades away - an illusion of a trail

        var length = this.snake.length-1;
        var temp = this.snakeTrail.getFirstExists(false);
        if(temp){
            temp.exists = true;
            temp.x = this.snake[length].x;
            temp.y = this.snake[length].y;
            temp.alpha = 0.8;
            temp.tint = 0xA9EE49;
            var trailTime = t*n;

            temp.tweenControl = this.add.tween(temp).to({alpha:0},trailTime,Phaser.Easing.Linear.None,true);
            temp.tweenControl.onComplete.add(function(){
                temp.exists = false;
            },this);
        }
    },

	initSnake : function(no){
		//create the snake - an array of sprites

		this.snake = [];
		var rX = this.world.randomX;
		var rY = this.world.randomY;
		for(var i=0; i<no;i++){
			var temp = this.add.sprite(rX+(no-i)*15,rY,'spriteSet','b');
			this.snake.push(temp);
		}
		//start the snake movement timer
		this.snakeMoveTimer = this.time.events.loop(150, this.moveSnake, this);
		this.snakeDirection = 0;
	},

	initSnakeTrail : function(no){
        this.snakeTrail = this.add.group();
        this.snakeTrail.createMultiple(no,'spriteSet','b',false);
    },

	update: function () {

	},

	startGame: function (pointer) {

		//set the global variables so the game knows what mode to start in.
		switch(pointer.text){
			case BasicGame.textList.easy : 	BasicGame.timerDelay = 250;
											BasicGame.currentMode = 'E';
											break;
			case BasicGame.textList.medium : 	BasicGame.timerDelay = 200;
												BasicGame.currentMode = 'M';
												break;
			case BasicGame.textList.hard : 	BasicGame.timerDelay = 100;
											BasicGame.currentMode = 'H';
											break;
		}

		//tween out the objects
		var tweenControl = this.add.tween(this.stateGroup).to({x:this.world.width+500},500,Phaser.Easing.Sinusoidal.InOut,true);
		tweenControl.onComplete.add(function(){

		//	And start the actual game
			this.state.start('Game');
		},this);

	}

};

//EndScreen - the screen to show highscores and current score. Very similar to the Main Menu - need to find ways to use functions across states
//without making them global

BasicGame.EndScreen = function(game){

};

BasicGame.EndScreen.prototype = {
	create : function(){

		this.stateGroup = this.add.group();

		this.initSnake(3);
		this.initSnakeTrail(10);

		this.titleSprite = this.add.sprite(this.world.centerX,this.world.centerY-100,'spriteSet','title');
		this.titleSprite.anchor.setTo(0.5,0.5);

		this.initScoreTexts();

		this.initBackButton();

		this.addToStateGroup();

		this.add.tween(this.stateGroup).from({x:-500},500,Phaser.Easing.Sinusoidal.InOut,true);
	},

	addToStateGroup : function(){
		for(var i=0;i<this.snake.length;i++){
            this.stateGroup.add(this.snake[i]);
        }
        this.stateGroup.add(this.snakeTrail);
        this.stateGroup.add(this.titleSprite);
        this.stateGroup.add(this.yourScoreText);
        this.stateGroup.add(this.highscoreText);
        this.stateGroup.add(this.backButton);
	},

	initScoreTexts : function(){

		this.yourScoreText = this.add.bitmapText(this.world.centerX,300,'olijo',BasicGame.textList.score+'\n'+BasicGame.score,28);
		this.yourScoreText.align = 'center';
		this.yourScoreText.x = this.world.centerX - this.yourScoreText.textWidth*0.5;
		var HS = 0;
		var tempText;
		//retrieve highscores according to mode
		switch(BasicGame.currentMode){
			case 'E' : 	HS = BasicGame.highscore.E;	
						tempText = BasicGame.textList.easy;
						break;
			case 'M' : 	HS = BasicGame.highscore.M;
						tempText = BasicGame.textList.medium;
						break;
			case 'H' : 	HS = BasicGame.highscore.H;
						tempText = BasicGame.textList.hard;
						break;
		}
		//compare if current score is more than highscore for that mode
		if(BasicGame.score<HS){
			this.highscoreText = this.add.bitmapText(this.world.centerX,400,'olijo',BasicGame.textList.highscore+' - '+tempText+'\n'+HS,28);
			this.highscoreText.align = 'center';
			this.highscoreText.x = this.world.centerX - this.highscoreText.textWidth*0.5;
		}
		else{
			//if yes, then set the new highscore to the localStorage
			switch(BasicGame.currentMode){
				case 'E' : BasicGame.highscore.E = BasicGame.score;
							break;
				case 'M' : BasicGame.highscore.M = BasicGame.score;
							break;
				case 'H' : BasicGame.highscore.H = BasicGame.score;
			}
			//local storage can only store key:value pairs, hence need to covert highscores to json string
			var tempString = {
				"E" : BasicGame.highscore.E, "M" : BasicGame.highscore.M, "H" : BasicGame.highscore.H
			}
			localStorage.setItem("HS",JSON.stringify(tempString));
			
			this.highscoreText = this.add.bitmapText(this.world.centerX,400,'olijo',tempText+' - '+BasicGame.textList.highscore+'!!!',28);
			this.highscoreText.align = 'center';
			this.highscoreText.x = this.world.centerX - this.highscoreText.textWidth*0.5;
		}
	},

	moveSnake : function(){
		
		if(this.snakeDirection==0||this.snakeDirection==1){
			this.newSnakeDirection = this.rnd.integerInRange(2,3);
		}
		else{
			this.newSnakeDirection = this.rnd.integerInRange(0,1);
		}
		if(this.math.chanceRoll(15)){
			this.snakeDirection = this.newSnakeDirection;
		}

		var length = this.snake.length;

		switch(this.snakeDirection){
            case 0    :     this.snake[length-1].y = this.snake[0].y - 15;
                            this.snake[length-1].x = this.snake[0].x;
                            break;
            case 1  :      	this.snake[length-1].y = this.snake[0].y + 15;
                            this.snake[length-1].x = this.snake[0].x;
                            break;
            case 2  :      	this.snake[length-1].x = this.snake[0].x - 15;
                            this.snake[length-1].y = this.snake[0].y;
                            break;
            case 3 :      	this.snake[length-1].x = this.snake[0].x + 15;
                            this.snake[length-1].y = this.snake[0].y;
                            break; 
        }
        
        if(this.snake[length-1].x>this.world.width-14){
            this.snake[length-1].x = 0;
        }
        if(this.snake[length-1].x<0){
            this.snake[length-1].x = this.world.width-16;
        }
        if(this.snake[length-1].y>this.world.height-14){
            this.snake[length-1].y = 0;
        }
        if(this.snake[length-1].y<0){
            this.snake[length-1].y = this.world.height-16;
        }

        temp = this.snake.pop();
        this.snake.unshift(temp);

        this.leaveTrail(150,6);

	},
	leaveTrail : function(t,n){
        var length = this.snake.length-1;
        var temp = this.snakeTrail.getFirstExists(false);
        if(temp){
            temp.exists = true;
            temp.x = this.snake[length].x;
            temp.y = this.snake[length].y;
            temp.alpha = 0.8;
            temp.tint = 0xA9EE49;
            var trailTime = t*n;

            temp.tweenControl = this.add.tween(temp).to({alpha:0},trailTime,Phaser.Easing.Linear.None,true);
            temp.tweenControl.onComplete.add(function(){
                temp.exists = false;
            },this);
        }
    },

	initSnake : function(no){
		this.snake = [];
		var rX = this.world.randomX;
		var rY = this.world.randomY;
		for(var i=0; i<no;i++){
			var temp = this.add.sprite(rX+(no-i)*15,rY,'spriteSet','b');
			this.snake.push(temp);
		}
		this.snakeMoveTimer = this.time.events.loop(150, this.moveSnake, this);
		this.snakeDirection = 0;
	},

	initSnakeTrail : function(no){
        this.snakeTrail = this.add.group();
        this.snakeTrail.createMultiple(no,'spriteSet','b',false);
    },

	initBackButton : function(){
        this.backButton = this.add.bitmapText(this.world.centerX,500,'olijo',BasicGame.textList.back,28);
        this.backButton.x = this.world.centerX - this.backButton.textWidth*0.5;
        this.backButton.inputEnabled = true;
        this.backButton.events.onInputDown.add(this.quitGame,this);
    },

    quitGame: function (pointer) {

    	var tweenControl = this.add.tween(this.stateGroup).to({x:this.world.width+500},500,Phaser.Easing.Sinusoidal.InOut,true);
		tweenControl.onComplete.add(function(){
			//go back to Main Menu
			this.state.start('MainMenu');
		},this);
	}
}