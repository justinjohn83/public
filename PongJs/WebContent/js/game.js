


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
		var w = parseInt(c.attr('width'),10);
		var h = parseInt(c.attr('height'),10);
		
		var ctx = this.getContext();
    	ctx.strokeStyle = '#000000';
    	ctx.fillStyle = '#000000';
    	
    	ctx.clearRect(0,0,w,h);
	},
	
	toScreenCoordinates:function(pos) {
		var c = $('#gameCanvas');
		var offset = c.offset();
		
		// make a copy
		var rPos = vector(pos);
		rPos.x += offset.left;
		rPos.y += offset.top;
		
		return rPos;
	},
	
	gameRect : function() {
		var c = $('#gameCanvas');
		var w = parseInt(c.attr('width'),10);
		var h = parseInt(c.attr('height'),10);
		
		return rect2D(0,0,w,h);
				
	},
		
	/*
	this.state = 0;
	this.leftPaddle = null;
	this.rightPaddle = null;
	this.ball = null;
	*/
	paused : false,
	state : 0,
	leftPaddle : 0,
	rightPaddle : 0,
	ball : 0,
	compPlayer : null,
	
	difficulty: 7,
	
	upPressed: false,
	downPressed : false,
	
	// constants
	MAX_SCORE : 11,
	SPEED : 7,
	BALL_SIZE: 8,
	PADDLE_LENGTH: 55,
	PADDLE_WIDTH: 10,
	PADDLE_VELOCITY : 40,
	BALL_VELOCITY_Y : 25,
	BALL_VELOCITY_X : 35,
	BALL_MAX_VELOCITY_X : 1.0 * Math.sqrt(2),
	BALL_MAX_VELOCITY_Y : 0.75 * Math.sqrt(2),
	
//	getPlayerPaddlePositionWorld: function() {
//		// returns a "vector" containing the screen position of the player's paddle center
//		// TODO: use this with a touch event listener in "pong.js" to convert to "up" and "down" key events
//	},
	
	init : function(diff) {
			
		this.paused = false;
		this.upPressed = this.downPressed = false;
		
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

		this._resetPositions();
		
		if(diff !== undefined) {
			this.difficulty = diff;
		}
		
		this.compPlayer = pongAI(
				this.ball,
				this.rightPaddle,
				this.gameRect(),
				this.difficulty);
			
	},
	
	_resetPositions : function() {
		
		var mult = -1;

		
		this.leftPaddle.position.x = 10;
		this.leftPaddle.position.y = 250 - this.PADDLE_LENGTH / 2;
		this.leftPaddle.maxVelocity.x = 0;
		this.leftPaddle.maxVelocity.y = this.SPEED * this.PADDLE_VELOCITY;
		this.leftPaddle.velocity.x = 0;
		this.leftPaddle.velocity.y = this.leftPaddle.maxVelocity.y;
		
		this.rightPaddle.position.x = 475;
		this.rightPaddle.position.y = 250 - this.PADDLE_LENGTH / 2;
		this.rightPaddle.maxVelocity.x = 0;
		this.rightPaddle.maxVelocity.y = this.SPEED * this.PADDLE_VELOCITY;
		this.rightPaddle.velocity.x = 0;
		this.rightPaddle.velocity.y = this.rightPaddle.maxVelocity.y;
		
		this.ball.position.x = 250;
		this.ball.position.y = 250;
		this.ball.maxVelocity.x = this.SPEED * this.BALL_MAX_VELOCITY_X;
		this.ball.maxVelocity.y = this.SPEED * this.BALL_MAX_VELOCITY_Y;

		if(this.state.attributes.gameEvent === GameEvent.LeftPlayerScored) {
			mult = 1;
		}
		this.ball.velocity.x = mult * this.BALL_VELOCITY_X * this.SPEED;
		this.ball.velocity.y = 0;
		
		if(this.compPlayer) {
			this.compPlayer.initPaddlePos();
		}
	},
	
	initGame: function() {
		this.state = gameState();
		this.state.leftPlayer.name = "Player1";
		this.state.rightPlayer.name = "Player2";
		
		this._updateScore();
		
	},
	
	_updateScore : function() {
		var leftPlayerName = $('#leftPlayer_name');
		var leftPlayerScore = $('#leftPlayer_score');
		var rightPlayerName = $('#rightPlayer_name');
		var rightPlayerScore = $('#rightPlayer_score');
		
		leftPlayerName.text(this.state.leftPlayer.name);
		leftPlayerScore.text(this.state.leftPlayer.score);
		rightPlayerName.text(this.state.rightPlayer.name);
		rightPlayerScore.text(this.state.rightPlayer.score);		
		
	},
	
	update : function(dt) {
		
		if(this.paused) {
			return false;
		}
		
		this.ball.position.x += dt * this.ball.velocity.x;
		this.ball.position.y += dt * this.ball.velocity.y;
		
		// check game events
		// TODO: paused state
		if(this.state.attributes.gameEvent === GameEvent.LeftPlayerScored || 
		   this.state.attributes.gameEvent === GameEvent.RightPlayerScored) {
			// TODO: check end of game
			this._resetPositions();
			this.state.attributes.gameEvent = null;
			
			if(this.state.leftPlayer.score >= this.MAX_SCORE || 
			   this.state.rightPlayer.score >= this.MAX_SCORE) {
				return false;
			}
		}
		
		if(!this.upPressed || !this.downPressed) {
			if(this.upPressed) {
				this.movePaddleUp(dt);
			}
			else if(this.downPressed) {
				this.movePaddleDown(dt);
			}
		}

		this.chkBallPaddleCollsions();
		this.chkBallWallCollisions();
		
		//execute AI engine
		this.compPlayer.movePaddle(dt);
		
		return true;
		
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
	calcVelocityMult: function(paddleBounds,ballBounds) {
		var maxDiff = paddleBounds.height / 2;
		var ballY = ballBounds.y; // - ballBounds.height / 2;
		var paddleY = paddleBounds.y + paddleBounds.height / 2;
		var yRelLoc = ballY - paddleY;
		// formula linear (0,0),(maxDiff,1.5)
		// y = 1.5 x / maxDiff
		return 1.5 * yRelLoc / maxDiff;
		

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
			
			this.state.attributes.collisionType = CollisionType.LeftPlayer;
			
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
			this.compPlayer.initPaddlePos();
			
			this.state.attributes.collisionType = CollisionType.RightPlayer;
			
//			[self offsetContainmentPaddleRect: compPaddleBounds ballRect:this.ballBounds];

			
		}

	},
	
	chkPaddleWallCollisions: function(thePaddle) {
		
		var canMove = thePaddle.clampToGameArea(this.gameRect());
		if(canMove > 0) {
			thePaddle.canMoveUp = false;
		}
		else if(canMove < 0) {
			thePaddle.canMoveDown = false;
		}
	},
	
	chkBallWallCollisions : function() {
		
		var gameArea = this.gameRect();
		var pongBallBounds = this.ball.boundingBox();
		var collisionType = this.state.attributes.collisionType;
		
		//check if ball intersects top or bottom of game window and update velocity vector
		if(!gameArea.intersects(pongBallBounds)) 
		{
			// clamp to playable area
			var pos = this.ball.position;
			var loc =  gameArea.clampPoint(pos);
			//pongBall.position = pos;
			
			// if ball intersects left side then right player scored
			if(collisionType !== CollisionType.LeftPlayer && loc === PointLocation.Left)
			{
				//reInit = TRUE;
				//go = FALSE;
				this.state.rightPlayer.score ++;
				
				this.state.attributes.gameEvent = GameEvent.RightPlayerScored;
				
				
				this.state.attributes.collisionType = CollisionType.LeftPlayer;
				
				this._updateScore();
				
			}
			// if ball intersects right side then left player has scored
			else if(collisionType !== CollisionType.RightPlayer && loc === PointLocation.Right)
			{
				//reInit = TRUE;
				//go = FALSE;
				this.state.leftPlayer.score ++;
				
				this.state.attributes.gameEvent = GameEvent.LeftPlayerScored;
				
				
				this.state.attributes.collisionType = CollisionType.RightPlayer;
				
				this._updateScore();
				
			}
			else 
			{
				this.state.attributes.collisionType = CollisionType.None;
				
				// switch direction
				this.ball.velocity.y = -this.ball.velocity.y;
				
			}
			
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



var vector = function(x,y) {
	
	var that = {};
	if(x !== undefined && y !== undefined) {
		that.x = x;
		that.y = y;
	}
	// assuming copy constructor
	else if(x !== undefined) {
		that.x = x.x;
		that.y = x.y;
	}
	// default constructor
	else {
		that.x = 0;
		that.y = 0;
	}
	
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
	that.size.x = Game.PADDLE_WIDTH;
	that.size.y = Game.PADDLE_LENGTH;
    
    that.draw = function() {
    	
    	this.context.strokeStyle = '#000000';
    	this.context.fillStyle = '#000000';
    	
    	this.context.beginPath();
    	// draw rectangle centered at position with fixed size
    	this.context.fillRect(this.position.x,this.position.y,this.size.x,this.size.y);
    	this.context.closePath();

    	
    };
    
    // return > 0 if can't move up, < 0 if can't move down and 0 if can move in both directions
    that.clampToGameArea = function(gameArea) {
    	// make a copy
    	gameArea = rect2D(gameArea.x,gameArea.y,gameArea.width,gameArea.height);
    	
		var paddleBounds = this.boundingBox();
		
		// must reduce size of game area
		gameArea.y += paddleBounds.height;
		gameArea.height -= 2 * paddleBounds.height;
		
		var offsetY = 0;
		//checking if a paddle collided with the top or bottom of the game window
		if(!gameArea.intersects(paddleBounds)) {
			// see if its closer to top or bottom
			var minY = gameArea.getMinY();
			var maxY = gameArea.getMaxY();
			
			// bottom
			var bottomDiff = Math.abs(minY - paddleBounds.getMaxY());
			var topDiff = Math.abs(maxY - paddleBounds.getMinY());
			
			if(bottomDiff <= topDiff) {
				offsetY = bottomDiff;
			}
			// top
			else {
				offsetY = -topDiff;
			}
			
		}
		
//		if(isNaN(offsetY)) {
//			throw "NaN";
//		}
		return offsetY;
    };
    
    return that;
};
//extends Shape

var ball = function() {
	
	var that = shape();
	that.size.x = Game.BALL_SIZE;
	that.size.y = Game.BALL_SIZE;
    
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
    
    // must override bounding box: circle shape position is the center
    // the rectangle shape position is upper left hand corner
    that.boundingBox = function() {
    	
    	return rect2D(this.position.x - this.size.x / 2,
    			      this.position.y - this.size.y / 2,
    			      this.size.x,
    			      this.size.y);
    };
    
    return that;
};

var PointLocation = {
		Inside : 0,
		Left : 1,
		Bottom : 2,
		Right : 3,
		Top : 4
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
   that.clampPoint = function(pt) {
		var minX = this.getMinX();
		var minY = this.getMinY();
		
		var diffX = pt.x - minX;
		var diffY = pt.y - minY;
		
		var loc = PointLocation.Inside;
		
		// test minimums
		if(diffX < 0 || diffY < 0)
		{
			if(diffX < 0 && diffY < 0)
			{
				pt.x = minX;
				pt.y = minY;
				if(diffX <= diffY)
					loc = PointLocation.Left;
				else
					loc = PointLocation.Bottom;
			}
			else if(diffX < 0)
			{
				pt.x = minX;
				loc = PointLocation.Left;
			}
			else // diffY < 0
			{
				pt.y = minY;
				loc = PointLocation.Bottom;
			}
			
			return loc;

		}
		
		// test maximums
		
		var maxX = this.getMaxX();
		var maxY = this.getMaxY();
		
		diffX = maxX - pt.x;
		diffY = maxY - pt.y;
		
		if(diffX < 0 || diffY < 0)
		{
			if(diffX < 0 && diffY < 0)
			{
				pt.x = maxX;
				pt.y = maxY;
				if(diffX <= diffY)
					loc = PointLocation.Right;
				else
					loc = PointLocation.Top;
			}
			else if(diffX < 0)
			{
				pt.x = maxX;
				loc = PointLocation.Right;
			}
			else // diffY < 0
			{
				pt.y = maxY;
				loc = PointLocation.Top;
			}
			
			return loc;
			
		}
		
		return loc;

   };
   
   that.getMinX = function() {
    	return this.x;
    };
    
    that.getMinY = function() {
    	return this.y;
    };
    
    that.getMaxX = function() {
    	return this.x + this.width;
    };
    that.getMaxY = function() {
    	return this.y + this.height;
    };
    
    that.getCenter = function() {
    	return vector(this.x + this.width / 2,
    				  this.y + this.height / 2);
    };
    
    that.getCenterX = function() {
    	return this.getCenter().x;
    };
    
    that.getCenterY = function() {
    	return this.getCenter().y;
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
	that.state = PlayState.NewGame;
	that.attributes = gameAttributes();
	
	return that;
};



var PlayState = {
	NewGame : 1,
	InProgress : 2,
	Complete : 3
};
var CollisionType = {
	None : 0,
	LeftPlayer : 1,
	RightPlayer : 2
	
};

var GameEvent = {
	LeftPlayerScored : 1,
	RightPlayerScored : 2,
	Paused : 3
};

var gameAttributes = function() {
	var that = {};
	
	that.collisionType = CollisionType.None;
	that.gameEvent = null;
	
	return that;
};



