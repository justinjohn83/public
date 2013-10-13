


// Game has public static variables and functions
var Game = (function() {
	var that = {};
	
	// FIXME: public variables
	that.paused = false;
	that.upPressed = false;
	that.downPressed = false;
	that.leftPaddle = null;
	that.rightPaddle = null;
	
	// private variables
	that.state = null;

	var ball = null;
	var compPlayer = null;
	
	var difficulty = 7;

	// constants
	var MAX_SCORE = that.MAX_SCORE = 11;
	var SPEED = that.SPEED = 7;
	var BALL_SIZE = that.BALL_SIZE = 8;
	var PADDLE_LENGTH= that.PADDLE_LENGTH = 55;
	var PADDLE_WIDTH= that.PADDLE_WIDTH = 10;
	var PADDLE_VELOCITY = that.PADDLE_VELOCITY = 40;
	var BALL_VELOCITY_Y = that.BALL_VELOCITY_Y = 25;
	var BALL_VELOCITY_X = that.BALL_VELOCITY_X = 35;
	var BALL_MAX_VELOCITY_X = that.BALL_MAX_VELOCITY_X = 1.0 * Math.sqrt(2);
	var BALL_MAX_VELOCITY_Y = that.BALL_MAX_VELOCITY_Y = 0.75 * Math.sqrt(2);
		
	function clear() {
		var c = $('#gameCanvas');
		var w = parseInt(c.attr('width'),10);
		var h = parseInt(c.attr('height'),10);
		
		var ctx = getContext();
    	ctx.strokeStyle = '#000000';
    	ctx.fillStyle = '#000000';
    	
    	ctx.clearRect(0,0,w,h);
	}
	
	function toScreenCoordinates(pos) {
		var c = $('#gameCanvas');
		var offset = c.offset();
		
		// make a copy
		var rPos = new Vector(pos);
		rPos.x += offset.left;
		rPos.y += offset.top;
		
		return rPos;
	}
	
	function gameRect() {
		var c = $('#gameCanvas');
		var w = parseInt(c.attr('width'),10);
		var h = parseInt(c.attr('height'),10);
		
		return new Rect2D(0,0,w,h);
				
	}
		
	
	// expose the private function through object method
	that.getContext = getContext;

	
	that.init = function(diff) {
			
		that.paused = false;
		that.upPressed = that.downPressed = false;
		
		//var speed = 10;
		//var speedX = 1/sqrt(2) * speed;
		//var speedY = 1/sqrt(2) * speed;
		
		// background
		clear();
		// black
		//ctx.fillStyle="#000000";
		
		// create paddles
		that.leftPaddle = new Paddle();
		that.rightPaddle = new Paddle();
		ball = new Ball();
		
		initGame();

		resetPositions();
		
		if(diff !== undefined) {
			difficulty = diff;
		}
		
		compPlayer = pongAI(
				ball,
				that.rightPaddle,
				gameRect(),
				difficulty);
			
	};
	
	function resetPositions() {
		
		var mult = -1;

		
		that.leftPaddle.position.x = 10;
		that.leftPaddle.position.y = 250 - PADDLE_LENGTH / 2;
		that.leftPaddle.maxVelocity.x = 0;
		that.leftPaddle.maxVelocity.y = SPEED * PADDLE_VELOCITY;
		that.leftPaddle.velocity.x = 0;
		that.leftPaddle.velocity.y = that.leftPaddle.maxVelocity.y;
		
		that.rightPaddle.position.x = 475;
		that.rightPaddle.position.y = 250 - PADDLE_LENGTH / 2;
		that.rightPaddle.maxVelocity.x = 0;
		that.rightPaddle.maxVelocity.y = SPEED * PADDLE_VELOCITY;
		that.rightPaddle.velocity.x = 0;
		that.rightPaddle.velocity.y = that.rightPaddle.maxVelocity.y;
		
		ball.position.x = 250;
		ball.position.y = 250;
		ball.maxVelocity.x = SPEED * BALL_MAX_VELOCITY_X;
		ball.maxVelocity.y = SPEED * BALL_MAX_VELOCITY_Y;

		if(that.state.attributes.gameEvent === GameEvent.LeftPlayerScored) {
			mult = 1;
		}
		ball.velocity.x = mult * BALL_VELOCITY_X * SPEED;
		ball.velocity.y = 0;
		
		if(compPlayer) {
			compPlayer.initPaddlePos();
		}
		
		that.rightPaddle.canMoveUp = true;
		that.leftPaddle.canMoveUp = true;
		that.rightPaddle.canMoveDown = true;
		that.leftPaddle.canMoveDown = true;


	}
	
	function initGame () {
		that.state = new GameState();
		that.state.leftPlayer.name = "Player1";
		that.state.rightPlayer.name = "Player2";
		
		updateScore();
		
	}
	
	function updateScore() {
		var leftPlayerName = $('#leftPlayer_name');
		var leftPlayerScore = $('#leftPlayer_score');
		var rightPlayerName = $('#rightPlayer_name');
		var rightPlayerScore = $('#rightPlayer_score');
		
		leftPlayerName.text(that.state.leftPlayer.name);
		leftPlayerScore.text(that.state.leftPlayer.score);
		rightPlayerName.text(that.state.rightPlayer.name);
		rightPlayerScore.text(that.state.rightPlayer.score);		
		
	}
	
	that.update = function(dt) {
		
		if(that.paused) {
			return false;
		}
		
		ball.position.x += dt * ball.velocity.x;
		ball.position.y += dt * ball.velocity.y;
		
		// check game events
		// TODO: paused that.state
		if(that.state.attributes.gameEvent === GameEvent.LeftPlayerScored || 
		   that.state.attributes.gameEvent === GameEvent.RightPlayerScored) {
			// TODO: check end of game
			resetPositions();
			that.state.attributes.gameEvent = null;
			
			if(that.state.leftPlayer.score >= MAX_SCORE || 
			   that.state.rightPlayer.score >= MAX_SCORE) {
				return false;
			}
		}
		
		if(!that.upPressed || !that.downPressed) {
			if(that.upPressed) {
				movePaddleUp(dt);
			}
			else if(that.downPressed) {
				movePaddleDown(dt);
			}
		}

		chkBallPaddleCollsions();
		chkBallWallCollisions();
		
		//execute AI engine
		compPlayer.movePaddle(dt);
		
		return true;
		
	};
	
	function movePaddleUp(dt) {
		if(!that.leftPaddle.canMoveDown) {
			that.leftPaddle.canMoveDown = true;
		}
		if(that.leftPaddle.canMoveUp) {
			that.leftPaddle.position.y -= dt * that.leftPaddle.velocity.y;
			chkPaddleWallCollisions(that.leftPaddle);
		}
	}
	
	function movePaddleDown(dt) {
		if(!that.leftPaddle.canMoveUp) {
			that.leftPaddle.canMoveUp = true;
		}
		if(that.leftPaddle.canMoveDown) {
			that.leftPaddle.position.y += dt * that.leftPaddle.velocity.y;
			chkPaddleWallCollisions(that.leftPaddle);
		}
	}
	
	
	// TODO: need to tweak this!
	function calcVelocityMult(paddleBounds,ballBounds) {
		var maxDiff = paddleBounds.height / 2;
		var ballY = ballBounds.y; // - ballBounds.height / 2;
		var paddleY = paddleBounds.y + paddleBounds.height / 2;
		var yRelLoc = ballY - paddleY;
		// formula linear (0,0),(maxDiff,1.5)
		// y = 1.5 x / maxDiff
		return 1.5 * yRelLoc / maxDiff;
		

	}
	
	function chkBallPaddleCollsions () {
		
		var yourPaddle = that.leftPaddle;
		var compPaddle = that.rightPaddle;
		
		var yourPaddleBounds = that.leftPaddle.boundingBox();
		var pongBallBounds =  ball.boundingBox();
		var compPaddleBounds = that.rightPaddle.boundingBox();
		
		if(ball.velocity.x < 0 && (yourPaddleBounds.intersects(pongBallBounds)
			|| (ball.position.x < yourPaddleBounds.x &&
				ball.position.y >= yourPaddleBounds.y &&
				ball.position.y <= yourPaddleBounds.y + yourPaddleBounds.height)))
		{
			//use formula to determine the new ball velocity in the y-direction
			//when the ball collides with the paddle
			ball.velocity.y = BALL_VELOCITY_Y * SPEED * calcVelocityMult(yourPaddleBounds,pongBallBounds);
			ball.velocity.x = -ball.velocity.x;
			
			that.state.attributes.collisionType = CollisionType.LeftPlayer;
			
		}
		else if(ball.velocity.x > 0 && (compPaddleBounds.intersects(pongBallBounds) ||
				(ball.position.x > compPaddleBounds.x + compPaddleBounds.width &&
				 ball.position.y >= compPaddleBounds.y &&
				 ball.position.y <= compPaddleBounds.y + compPaddleBounds.height)))
		{
			//use formula to determine the new ball velocity in the y-direction
			//when the ball collides with the paddle
			ball.velocity.y = BALL_VELOCITY_Y * SPEED * calcVelocityMult(compPaddleBounds,pongBallBounds);
			ball.velocity.x = -ball.velocity.x;
			
			//calculate a new aiming position
			compPlayer.initPaddlePos();
			
			that.state.attributes.collisionType = CollisionType.RightPlayer;
			
//			[self offsetContainmentPaddleRect: compPaddleBounds ballRect:ballBounds];

			
		}

	}
	
	function chkPaddleWallCollisions(thePaddle) {
		
		var canMove = thePaddle.clampToGameArea(gameRect());
		if(canMove > 0) {
			thePaddle.canMoveUp = false;
		}
		else if(canMove < 0) {
			thePaddle.canMoveDown = false;
		}
	}
	
	function chkBallWallCollisions() {
		
		var gameArea = gameRect();
		var pongBallBounds = ball.boundingBox();
		var collisionType = that.state.attributes.collisionType;
		
		//check if ball intersects top or bottom of game window and update velocity vector
		if(!gameArea.intersects(pongBallBounds)) 
		{
			// clamp to playable area
			var pos = ball.position;
			var loc =  gameArea.clampPoint(pos);
			//pongBall.position = pos;
			
			// if ball intersects left side then right player scored
			if(collisionType !== CollisionType.LeftPlayer && loc === PointLocation.Left)
			{
				//reInit = TRUE;
				//go = FALSE;
				that.state.rightPlayer.score ++;
				
				that.state.attributes.gameEvent = GameEvent.RightPlayerScored;
				
				
				that.state.attributes.collisionType = CollisionType.LeftPlayer;
				
				updateScore();
				
			}
			// if ball intersects right side then left player has scored
			else if(collisionType !== CollisionType.RightPlayer && loc === PointLocation.Right)
			{
				//reInit = TRUE;
				//go = FALSE;
				that.state.leftPlayer.score ++;
				
				that.state.attributes.gameEvent = GameEvent.LeftPlayerScored;
				
				
				that.state.attributes.collisionType = CollisionType.RightPlayer;
				
				updateScore();
				
			}
			else 
			{
				that.state.attributes.collisionType = CollisionType.None;
				
				// switch direction
				ball.velocity.y = -ball.velocity.y;
				
			}
			
		}
	}

	function drawBackground() {
		var ctx = getContext();
		
		var c = $('#gameCanvas');
		var w = c.attr('width');
		var h = c.attr('height');
		
	    ctx.beginPath();
		ctx.rect(0,0,w,h);
		ctx.closePath();
		ctx.stroke();

	}
	
	that.draw = function() {
		// draw
		// clear the back buffer
		clear();
		
		drawBackground();
		
		//ctx.stroke();
		
		that.leftPaddle.draw();
		that.rightPaddle.draw();
		ball.draw();
	};
	
	return that;

	
}());
