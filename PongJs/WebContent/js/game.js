


// Game has public static variables and functions
// TODO: see http://stackoverflow.com/questions/10834332/static-variables-in-a-javascript-class
// for a better way of declaring public static functions and private static variables
var Game = {
		
	getContext: function () {
			var c = document.getElementById("gameCanvas");
			var ctx = c.getContext("2d");
			return ctx;
		},
		
	clear : function() {
		var c = $('#gameCanvas');
		var w = c.attr('width');
		var h = c.attr('height');
		
		var ctx = this.getContext();
    	ctx.strokeStyle = '#000000';
    	ctx.fillStyle = '#000000';
    	
    	ctx.clearRect(0,0,w,h);
	},
	
	gameRect : function() {
		var c = $('#gameCanvas');
		var w = c.attr('width');
		var h = c.attr('height');
		
		return rect2D(0,0,w,h);
				
	},
		
	/*
	this.state = 0;
	this.leftPaddle = null;
	this.rightPaddle = null;
	this.ball = null;
	*/
	state : 0,
	leftPaddle : 0,
	rightPaddle : 0,
	ball : 0,
	
	// constants
	SPEED : 5,
	PADDLE_VELOCITY : 40,
	BALL_VELOCITY_Y : 25,
	BALL_VELOCITY_X : 35,
	BALL_MAX_VELOCITY_X : 1.0 * Math.sqrt(2),
	BALL_MAX_VELOCITY_Y : 0.75 * Math.sqrt(2),
	
	init : function() {
		
		
		var ctx = this.getContext();
		//var speed = 10;
		//var speedX = 1/sqrt(2) * speed;
		//var speedY = 1/sqrt(2) * speed;
		
		// background
		this.clear();
		// black
		//ctx.fillStyle="#000000";
		
		// create paddles
		this.leftPaddle = paddle();
		this.rightPaddle = paddle();
		this.ball = ball();
		
		this.initGame();

		
		this.leftPaddle.position.x = 10;
		this.leftPaddle.position.y = 250;
		this.leftPaddle.maxVelocity.x = 0;
		this.leftPaddle.maxVelocity.y = this.SPEED * this.PADDLE_VELOCITY;
		this.leftPaddle.velocity.x = 0;
		this.leftPaddle.velocity.y = this.leftPaddle.maxVelocity.y;
		
		this.rightPaddle.position.x = 475;
		this.rightPaddle.position.y = 250;
		this.rightPaddle.maxVelocity.x = 0;
		this.rightPaddle.maxVelocity.y = this.SPEED * this.PADDLE_VELOCITY;
		this.leftPaddle.velocity.x = 0;
		this.leftPaddle.velocity.y = this.rightPaddle.maxVelocity.y;
		
		this.ball.position.x = 250;
		this.ball.position.y = 250;
		this.ball.maxVelocity.x = this.SPEED * this.BALL_MAX_VELOCITY_X;
		this.ball.maxVelocity.y = this.SPEED * this.BALL_MAX_VELOCITY_Y;
		// TODO: last player who lost gets to hit the ball first
		this.ball.velocity.x = -this.BALL_VELOCITY_X * this.SPEED;
		this.ball.velocity.y = 0;
			
	},
	
	initGame: function() {
		this.state = gameState();
		this.state.leftPlayer.name = "Player 1";
		this.state.rightPlayer.name = "Player 2";
		
	},
	
	_updateScore : function() {
		// TODO: update the html elements of the score when score changes
		
	},
	
	update : function(dt) {
		
		this.ball.position.x += dt * this.ball.velocity.x;
		this.ball.position.y += dt * this.ball.velocity.y;
		
		if(!keydown.up || !keydown.down) {
			if(keydown.up) {
				this.movePaddleUp(dt);
			}
			else if(keydown.down) {
				this.movePaddleDown(dt);
			}
		}

		this.chkBallPaddleCollsions();
		this.chkBallWallCollisions();
		
	},
	// TODO: these two movePaddleUp and movePaddleDown should be private
	movePaddleUp: function(dt) {
		if(!this.leftPaddle.canMoveDown) {
			this.leftPaddle.canMoveDown = true;
		}
		if(this.leftPaddle.canMoveUp) {
			this.leftPaddle.position.y -= dt * this.leftPaddle.velocity.y;
			this.chkPaddleWallCollisions(this.leftPaddle);
		}
	},
	
	movePaddleDown: function(dt) {
		if(!this.leftPaddle.canMoveUp) {
			this.leftPaddle.canMoveUp = true;
		}
		if(this.leftPaddle.canMoveDown) {
			this.leftPaddle.position.y += dt * this.leftPaddle.velocity.y;
			this.chkPaddleWallCollisions(this.leftPaddle);
		}
	},
	
	
	// TODO: need to tweak this!
	calcVelocityMult: function(ballBounds,paddleBounds) {
		var maxDiff = paddleBounds.height / 2;
		var xRelLoc = Math.abs(ballBounds.y - paddleBounds.y);
		// formula linear (0,0),(maxDiff,1.5)
		// y = 1.5 x / maxDiff
		return 1.5 * xRelLoc / maxDiff;
		

	},
	
	chkBallPaddleCollsions : function() {
		
		var yourPaddle = this.leftPaddle;
		var compPaddle = this.rightPaddle;
		
		var yourPaddleBounds = this.leftPaddle.boundingBox();
		var pongBallBounds =  this.ball.boundingBox();
		var compPaddleBounds = this.rightPaddle.boundingBox();
		
		if(this.ball.velocity.x < 0 && (yourPaddleBounds.intersects(pongBallBounds)
			|| (this.ball.position.x < yourPaddleBounds.x &&
				this.ball.position.y >= yourPaddleBounds.y &&
				this.ball.position.y <= yourPaddleBounds.y + yourPaddleBounds.height)))
		{
			//use formula to determine the new ball velocity in the y-direction
			//when the ball collides with the paddle
			this.ball.velocity.y = this.BALL_VELOCITY_Y * this.SPEED * this.calcVelocityMult(yourPaddleBounds,pongBallBounds);
			this.ball.velocity.x = -this.ball.velocity.x;
			
			//collisionType = Player;
			
		}
		else if(this.ball.velocity.x > 0 && (compPaddleBounds.intersects(pongBallBounds) ||
				(this.ball.position.x > compPaddleBounds.x + compPaddleBounds.width &&
				 this.ball.position.y >= compPaddleBounds.y &&
				 this.ball.position.y <= compPaddleBounds.y + compPaddleBounds.height)))
		{
			//use formula to determine the new ball velocity in the y-direction
			//when the ball collides with the paddle
			this.ball.velocity.y = this.BALL_VELOCITY_Y * this.SPEED * this.calcVelocityMult(compPaddleBounds,pongBallBounds);
			this.ball.velocity.x = -this.ball.velocity.x;
			
			//calculate a new aiming position
			//compPlayer->initPaddlePos();
			
			//collisionType = Computer;
			
//			[self offsetContainmentPaddleRect: compPaddleBounds ballRect:this.ballBounds];

			
		}

	},
	
	chkPaddleWallCollisions: function(thePaddle) {
		var paddleBounds = thePaddle.boundingBox();
		var gameArea = this.gameRect();
		// must reduce size of game area
		gameArea.y += paddleBounds.height;
		gameArea.height -= 2 * paddleBounds.height;
		
		//checking if a paddle collided with the top or bottom of the game window
		if(!gameArea.intersects(paddleBounds))
		{
			// see if its closer to top or bottom
			var minY = gameArea.getMinY();
			var maxY = gameArea.getMaxY();
			
			// bottom
			if(Math.abs(minY - thePaddle.position.y) <=
			   Math.abs(maxY - thePaddle.position.y))
			{
				thePaddle.canMoveUp = false;
			}
			// top
			else
			{
				thePaddle.canMoveDown = false;
			}
			
		}
	},
	
	chkBallWallCollisions : function() {
		
		var gameArea = this.gameRect();
		var pongBallBounds = this.ball.boundingBox();
		
		//check if ball intersects top or bottom of game window and update velocity vector
		if(!gameArea.intersects(pongBallBounds)) 
		{
			// clamp to playable area
			var pos = this.ball.position;
			//tp_location loc = tp_clampPointToRect(&gameArea,&pos);
			//pongBall.position = pos;
			
			// if ball intersects left side then computer player scored
//			if(collisionType != Player && loc == TPLeft)
//			{
//				reInit = TRUE;
//				go = FALSE;
//				compScore ++;
//				
//				playerLastScored = FALSE;
//				
//				NSString *score = [NSString stringWithFormat:@"%d",compScore];
//				[compScoreLabel setString:score];
//				
//				collisionType = Player;
//				
//			}
//			// if ball intersects right side then player has scored
//			else if(collisionType != Computer && loc == TPRight)
//			{
//				reInit = TRUE;
//				go = FALSE;
//				yourScore ++;
//				
//				playerLastScored = TRUE;
//				
//				NSString *score = [NSString stringWithFormat:@"%d",yourScore];
//				[playerScoreLabel setString:score];
//				
//				collisionType = Computer;
//				
//			}
//			else 
//			{
//				collisionType = None;
				
				// switch direction
				this.ball.velocity.y = -this.ball.velocity.y;
				
//			}
			
		}
	},

	_drawBackground: function() {
		var ctx = this.getContext();
		
		var c = $('#gameCanvas');
		var w = c.attr('width');
		var h = c.attr('height');
		
	    ctx.beginPath();
		ctx.rect(0,0,w,h);
		ctx.closePath();
		ctx.stroke();

	},
	
	draw : function() {
		// draw
		// clear the back buffer
		this.clear();
		
		this._drawBackground();
		
		//ctx.stroke();
		
		this.leftPaddle.draw();
		this.rightPaddle.draw();
		this.ball.draw();
	},
	
	
};

/*
function Vector(x,y) {
	this.x = x;
	this.y = y;
};
*/


// rgb
var color = function() {
	
	var that = {};
	that.r = 0;
	that.g = 0;
	that.b = 0;
	
	return that;
};



var vector = function() {
	
	var that = {};
	that.x = 0;
	that.y = 0;
	
	return that;
};

var shape = function () {
	
	var that = {};
	
	that.color = color();
	that.context = Game.getContext();
	
	that.position = vector();
	that.velocity = vector();
	that.maxVelocity = vector();
	that.size = vector();
    
    that.update = function(dt)
    {
    	// make sure that we don't exceed max velocity
    	var vx = velocity.x;
    	var vy = velocity.y;
    	var mvx = maxVelocity.x;
    	var mvy = maxVelocity.y;
    	
    	if(Math.abs(vx) > mvx)
    	{
    		if(vx >= 0)
    			velocity.x = mvx;
    		else
    			velocity.x = -mvx;

    	}
    	if(Math.abs(vy) > mvy)
    	{
    		if(vy >= 0)
    			velocity.y = mvy;
    		else
    			velocity.y = -mvy;

    	}
    };
    
    that.boundingBox = function() {
    	
    	return rect2D(this.position.x,this.position.y,this.size.x,this.size.y);
    };
    
    return that;
	
};


var paddle = function() {
	
	var that = shape();
	
	that.canMoveUp = true;
	that.canMoveDown = true;
	that.size.x = 15;
	that.size.y = 100;
    
    that.draw = function() {
    	
    	this.context.strokeStyle = '#000000';
    	this.context.fillStyle = '#000000';
    	
    	this.context.beginPath();
    	// draw rectangle centered at position with fixed size
    	this.context.fillRect(this.position.x,this.position.y,this.size.x,this.size.y);
    	this.context.closePath();

    	
    };
    
    return that;
};
//extends Shape

var ball = function() {
	
	var that = shape();
	that.size.x = 10;
	that.size.y = 10;
    
    that.draw = function() {
    	// draw circle
    	//var prevStroke = this.context.strokeStyle;
    	this.context.strokeStyle = '#FF0000';
    	this.context.fillStyle = '#FF0000';
    	this.context.beginPath();
    	this.context.arc(this.position.x,this.position.y,this.size.x,0,2*Math.PI);
    	this.context.closePath();
    	this.context.fill();
    	
    	//this.context.strokeStyle = prevStroke;
    };
    
    return that;
};

var rect2D = function(x,y,width,height) {
	var that = {};
	
	if(typeof x !== undefined) {
		that.x = x;
		that.y = y;
		that.width = width;
		that.height = height;
	}
	else {
		that.x = that.y = that.width = that.height = 0;
	}
	
	that.intersects = function(r) {
		//http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
		return this.x < r.x + r.width &&
		       this.x + this.width > r.x &&
		       this.y < r.y + r.height &&
		       this.y + this.height > r.y;
			
           };
   that.getMinX = function() {
    	return this.x;
    };
    
    that.getMinY = function() {
    	return this.y;
    };
    
    that.getMidX = function() {
    	return (this.x + this.width) / 2;
    };
    that.getMidY = function() {
    	return (this.y + this.height) / 2;
    };
    that.getMaxX = function() {
    	return this.x + this.width;
    };
    that.getMaxY = function() {
    	return this.y + this.height;
    };
	
    return that;
	
};

var player = function() {
	var that = {};
	that.name = "Player";
	that.score = 0;
	that.id = -1;
	
	return that;
};

var gameState = function() {
	var that = {};
	that.id = -1;
	that.leftPlayer = player();
	that.rightPlayer = player();
	that.state = 0;
	
	return that;
};



