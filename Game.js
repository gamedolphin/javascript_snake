
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

	create: function () {

        //keep the pixel perfect lines of the background mesh
        this.stage.smoothed = false;

        this.stateGroup = this.add.group();

        this.fx = this.add.audio('eat');
        this.playSounds = true;

        //the background mesh
        this.bckGraph = this.add.sprite(30,80,'spriteSet','bck');

        BasicGame.score = 0; //initialize score
        
        this.initSnake(3);
        this.initSnakeTrail(100);

        this.initTimer(BasicGame.timerDelay);

        this.initFood();

        this.initScoreText();

        this.initBackButton();

        this.initOnScreenControls();

        this.addToStateGroup();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.tween(this.stateGroup).from({x:-500},500,Phaser.Easing.Sinusoidal.InOut,true);
	},

    addToStateGroup : function(){
        
        this.stateGroup.add(this.bckGraph);
        this.stateGroup.add(this.scoreText);
        this.stateGroup.add(this.backButton);
        this.stateGroup.add(this.osc);
        this.stateGroup.add(this.soundButton);
        for(var i=0;i<this.snake.length;i++){
            this.stateGroup.add(this.snake[i]);
        }

        this.stateGroup.add(this.snakeTrail);
        this.stateGroup.add(this.food);
    },

    initOnScreenControls : function(){
        this.osc = this.add.sprite(this.world.centerX-40,400,'spriteSet','osc');
        this.osc.anchor.setTo(0.5,0);
        this.osc.inputEnabled = true;
        this.osc.events.onInputDown.add(this.oscChange,this);

        this.soundButton = this.add.sprite(this.world.width-30,400,'spriteSet','so');
        this.soundButton.anchor.setTo(1,0);
        this.soundButton.inputEnabled = true;
        this.soundButton.events.onInputDown.add(this.toggleSounds,this);
    },

    toggleSounds : function(){
        if(this.playSounds==true){
            this.playSounds = false;
            this.soundButton.frameName = 'soff';
        }
        else{
            this.playSounds = true;
            this.soundButton.frameName = 'so';
        }
    },

    moveSnake : function(){
        //move the snake by basically moving the tail to its head position + direction of movement

        var length = this.snake.length;
        this.leaveTrail(BasicGame.timerDelay,BasicGame.trailno);
        var temp;
        switch(this.snakeDirection){
            case 'up'    :      this.snake[length-1].y = this.snake[0].y - 15;
                                this.snake[length-1].x = this.snake[0].x;
                                break;
            case 'down'  :      this.snake[length-1].y = this.snake[0].y + 15;
                                this.snake[length-1].x = this.snake[0].x;
                                break;
            case 'left'  :      this.snake[length-1].x = this.snake[0].x - 15;
                                this.snake[length-1].y = this.snake[0].y;
                                break;
            case 'right' :      this.snake[length-1].x = this.snake[0].x + 15;
                                this.snake[length-1].y = this.snake[0].y;
                                break; 
        }
        
        if(this.snake[length-1].x>this.bckGraph.x+this.bckGraph.width-14){
            this.snake[length-1].x = this.bckGraph.x;
        }
        if(this.snake[length-1].x<this.bckGraph.x){
            this.snake[length-1].x = this.bckGraph.x+this.bckGraph.width-17;
        }
        if(this.snake[length-1].y>this.bckGraph.y+this.bckGraph.height-14){
            this.snake[length-1].y = this.bckGraph.y+1;
        }
        if(this.snake[length-1].y<this.bckGraph.y){
            this.snake[length-1].y = this.bckGraph.y+this.bckGraph.height-16;
        }

        if(this.checkOverlapSnake()){
            this.gameOver();
        }

        if(this.checkOverlap(this.snake[0],this.food)){

            this.tweenFoodEffect();

            if(this.playSounds==true){
                this.fx.play();
            }
            
            this.initFood();
            
            this.growSnake();

            BasicGame.score++;

            this.scoreText.setText(BasicGame.textList.score + ' : '+BasicGame.score);
        }
        temp = this.snake.pop();
        this.snake.unshift(temp);

        this.canMove = true;
    },

    tweenFoodEffect : function(){
        //special effects when the food is eaten
        this.tweenedFood.reset(this.food.x+this.food.width*0.5,this.food.y+this.food.height*0.5);
        this.tweenedFood.alpha = 1;
        this.tweenedFood.scale.setTo(1,1);
        this.tweenedFood.anchor.setTo(0.5,0.5);
        this.tweenedFood.exists = true;
        this.add.tween(this.tweenedFood.scale).to({x:5,y:5},500,Phaser.Easing.Linear.InOut,true);
        var tweenControl = this.add.tween(this.tweenedFood).to({alpha:0},500,Phaser.Easing.Linear.InOut,true);
        tweenControl.onComplete.add(function(){
            this.tweenedFood.exists = false;
        },this);
    },  

    leaveTrail : function(t,n){
        //leaving a trail
        var length = this.snake.length-1;
        var temp = this.snakeTrail.getFirstExists(false);
        if(temp){
            temp.exists = true;
            temp.x = this.snake[length].x;
            temp.y = this.snake[length].y;
            temp.tint = 0xA9EE49;   //green tint
            temp.alpha = 0.8;
            var trailTime = t*n;

            temp.tweenControl = this.add.tween(temp).to({alpha:0},trailTime,Phaser.Easing.Linear.None,true);
            temp.tweenControl.onComplete.add(function(){
                temp.exists = false;
            },this);
        }
    },

    growSnake : function(){
        //add new body part
        var temp = this.add.sprite(0,0,'spriteSet','b');
        this.stateGroup.add(temp);
        temp.x = this.snake[1].x;
        temp.y = this.snake[1].y;
        this.snake.splice(1,0,temp);
    },

    checkOverlapSnake : function(){
        //check over lap with self
        var temp;
        for(var i=1;i<this.snake.length;i++){
            temp = this.snake[i];
            if(this.checkOverlap(this.snake[0],temp)){
                return true;
            }
        }
        return false;
    },

    checkOverlap : function(a,b){
        //check overlap between bodies
        //bounds are resized because the actual sprites are smaller than their bounds
        var boundsA = a.getBounds();
        boundsA.height = boundsA.width = 13;
        boundsA.x++;
        boundsA.y++;
        var boundsB = b.getBounds();
        boundsB.height = boundsB.width = 13;
        boundsB.x++;
        boundsB.y++;
        return Phaser.Rectangle.intersects(boundsA,boundsB); 
    },

    initBackButton : function(){
        this.backButton = this.add.bitmapText(0,30,'olijo',BasicGame.textList.back,28);
        this.backButton.x = this.bckGraph.x + this.bckGraph.width - this.backButton.textWidth;
        this.backButton.inputEnabled = true;
        this.backButton.events.onInputDown.add(this.quitGame,this);
    },

    initScoreText : function(){
        this.scoreText = this.add.bitmapText(30,30,'olijo',BasicGame.textList.score+' : 0',28);
        
    },

    initFood : function(){
        var rndX = this.rnd.integerInRange(0,19);
        var rndY = this.rnd.integerInRange(0,19);

        this.food.reset(this.bckGraph.x+(rndX*15),this.bckGraph.y+(rndY*15)+1);
    },

    initTimer : function(no){
        this.snakeMoveTimer = this.time.events.loop(no, this.moveSnake, this);
    },


    initSnake : function(no){
        this.snake = [];
        for(var i=0;i<no;i++){
            var temp = this.add.sprite(0,0,'spriteSet','b');
            temp.x = this.bckGraph.x + (no-i)*15;
            temp.y = this.bckGraph.y+1;
            this.snake.push(temp);
        }
        this.snakeDirection = 'right';
        this.canMove = true;

        //also initialize food and the food effect sprite
        this.food = this.add.sprite(0,0,'spriteSet','f');
        this.tweenedFood = this.add.sprite(0,0,'spriteSet','f');
        this.tweenedFood.exists = false;
    },

    initSnakeTrail : function(no){
        this.snakeTrail = this.add.group();
        this.snakeTrail.createMultiple(no,'spriteSet','b',false);
    },

	update: function () {
        //change snake direction 

        if(this.canMove==true){

            if (this.cursors.up.isDown)
            {
                if(this.snakeDirection!='down'&&this.snakeDirection!='up'){
                    this.snakeDirection = 'up';
                    this.canMove=false;
                }
            }
            else if (this.cursors.down.isDown)
            {
                if(this.snakeDirection!='up'&&this.snakeDirection!='down'){
                    this.snakeDirection = 'down';
                    this.canMove=false;
                }
                
            }
            if (this.cursors.left.isDown)
            {
                if(this.snakeDirection!='right'&&this.snakeDirection!='left'){
                    this.snakeDirection = 'left';
                    this.canMove=false;
                }
            }
            else if (this.cursors.right.isDown)
            {
                if(this.snakeDirection!='left'&&this.snakeDirection!='right'){
                    this.snakeDirection = 'right';
                    this.canMove=false;
                }
            }
        }
	},

    oscChange : function(controls,pointer){
        //change snake direction
        var oscY = this.osc.y + this.osc.height*0.5;
        var oscX = this.osc.x;
        if(this.canMove){

            if(pointer.x>oscX+20&&pointer.y<oscY+20&&pointer.y>oscY-20){

                if(this.snakeDirection!='left'&&this.snakeDirection!='right'){
                    this.snakeDirection = 'right';
                    this.canMove=false;
                }
            }
            else if(pointer.x<oscX-20&&pointer.y<oscY+20&&pointer.y>oscY-20){
                if(this.snakeDirection!='right'&&this.snakeDirection!='left'){
                    this.snakeDirection = 'left';
                    this.canMove=false;
                }
            }
            else if(pointer.y>oscY+20&&pointer.x>oscX-20&&pointer.x<oscX+20){
                if(this.snakeDirection!='up'&&this.snakeDirection!='down'){
                    this.snakeDirection = 'down';
                    this.canMove=false;
                }
            }
            else if(pointer.y<oscY-20&&pointer.x>oscX-20&&pointer.x<oscX+20){
                if(this.snakeDirection!='down'&&this.snakeDirection!='up'){
                    this.snakeDirection = 'up';
                    this.canMove=false;
                }
            }
        }
    },

    gameOver : function(){
        var tweenControl = this.add.tween(this.stateGroup).to({x:this.world.width+500},500,Phaser.Easing.Sinusoidal.InOut,true);
        tweenControl.onComplete.add(function(){
            //go to Endscreen
            this.state.start('EndScreen');
        },this);
        
    },  

	quitGame: function (pointer) {

        var tweenControl = this.add.tween(this.stateGroup).to({x:this.world.width+500},500,Phaser.Easing.Sinusoidal.InOut,true);
        tweenControl.onComplete.add(function(){
            //go to Main Menu
            this.state.start('MainMenu');
        },this);

	}

};
