
var pongAI = function(ball,paddle,gameRect,difficulty) {
	var that = {};
	
	// private fields
	var m_ball = ball;
	var m_paddle = paddle;
	var m_gameRect = gameRect;
	var m_difficulty = difficulty;
	var m_moveProb = null; //prob comp player will move toward ball (0-100)
	var m_trackProb = null; // tracking ai probability
	var m_isTrackAI = false;
	var m_aimProb = []; // 0-10 indices
	var m_paddlePos = -1; 
	
	// private methods

	var randInt = function(a,b) {
		return (Math.random() * (b - a + 1)) + a;
	};
	
	var feq = function(a,b) {
		return Math.abs(a - b) > 0.001;
	};
	
	var initAI = function() {
		switch(m_difficulty)
		{
			case 1:
				m_moveProb = 50;
				m_trackProb = 10;
				
				m_aimProb[0] = 5;
				m_aimProb[1] = 5;
				m_aimProb[2] = 5;
				m_aimProb[3] = 10;
				m_aimProb[4] = 15;
				m_aimProb[5] = 20;
				m_aimProb[6] = 15;
				m_aimProb[7] = 10;
				m_aimProb[8] = 5;
				m_aimProb[9] = 5;
				m_aimProb[10] = 5;
				break;
			case 2:
				m_moveProb = 55;
				m_trackProb = 20;
				
				m_aimProb[0] = 5;
				m_aimProb[1] = 7;
				m_aimProb[2] = 8;
				m_aimProb[3] = 10;
				m_aimProb[4] = 12;
				m_aimProb[5] = 16;
				m_aimProb[6] = 12;
				m_aimProb[7] = 10;
				m_aimProb[8] = 8;
				m_aimProb[9] = 7;
				m_aimProb[10] = 5;
				break;
			case 3:
				m_moveProb = 60;
				m_trackProb = 25;
				
				m_aimProb[0] = 7;
				m_aimProb[1] = 8;
				m_aimProb[2] = 9;
				m_aimProb[3] = 12;
				m_aimProb[4] = 9;
				m_aimProb[5] = 10;
				m_aimProb[6] = 9;
				m_aimProb[7] = 12;
				m_aimProb[8] = 9;
				m_aimProb[9] = 8;
				m_aimProb[10] = 7;
				break;
			case 4:
				m_moveProb = 65;
				m_trackProb = 30;
				
				m_aimProb[0] = 10;
				m_aimProb[1] = 10;
				m_aimProb[2] = 15;
				m_aimProb[3] = 7;
				m_aimProb[4] = 5;
				m_aimProb[5] = 6;
				m_aimProb[6] = 5;
				m_aimProb[7] = 7;
				m_aimProb[8] = 15;
				m_aimProb[9] = 10;
				m_aimProb[10] = 10;
				break;
			case 5:
				m_moveProb = 70;
				m_trackProb = 35;
				
				m_aimProb[0] = 12;
				m_aimProb[1] = 15;
				m_aimProb[2] = 8;
				m_aimProb[3] = 7;
				m_aimProb[4] = 6;
				m_aimProb[5] = 4;
				m_aimProb[6] = 6;
				m_aimProb[7] = 7;
				m_aimProb[8] = 8;
				m_aimProb[9] = 15;
				m_aimProb[10] = 12;
				break;
			case 6:
				m_moveProb = 75;
				m_trackProb = 40;
				
				m_aimProb[0] = 18;
				m_aimProb[1] = 15;
				m_aimProb[2] = 9;
				m_aimProb[3] = 5;
				m_aimProb[4] = 3;
				m_aimProb[5] = 0;
				m_aimProb[6] = 3;
				m_aimProb[7] = 5;
				m_aimProb[8] = 9;
				m_aimProb[9] = 15;
				m_aimProb[10] = 18;
				break;
			case 7:
				m_moveProb = 80;
				m_trackProb = 45;
				
				m_aimProb[0] = 23;
				m_aimProb[1] = 12;
				m_aimProb[2] = 10;
				m_aimProb[3] = 4;
				m_aimProb[4] = 1;
				m_aimProb[5] = 0;
				m_aimProb[6] = 1;
				m_aimProb[7] = 4;
				m_aimProb[8] = 10;
				m_aimProb[9] = 12;
				m_aimProb[10] = 23;
				break;
			case 8:
				m_moveProb = 85;
				m_trackProb = 50;
				
				m_aimProb[0] = 30;
				m_aimProb[1] = 12;
				m_aimProb[2] = 6;
				m_aimProb[3] = 2;
				m_aimProb[4] = 0;
				m_aimProb[5] = 0;
				m_aimProb[6] = 0;
				m_aimProb[7] = 2;
				m_aimProb[8] = 6;
				m_aimProb[9] = 12;
				m_aimProb[10] = 30;
				break;
			case 9:
				m_moveProb = 90;
				m_trackProb = 60;
				
				m_aimProb[0] = 35;
				m_aimProb[1] = 10;
				m_aimProb[2] = 5;
				m_aimProb[3] = 0;
				m_aimProb[4] = 0;
				m_aimProb[5] = 0;
				m_aimProb[6] = 0;
				m_aimProb[7] = 0;
				m_aimProb[8] = 5;
				m_aimProb[9] = 10;
				m_aimProb[10] = 35;
				/*m_aimProb[0] = 35;
				 m_aimProb[1] = 10;
				 m_aimProb[2] = 4;
				 m_aimProb[3] = 1;
				 m_aimProb[4] = 0;
				 m_aimProb[5] = 0;
				 m_aimProb[6] = 0;
				 m_aimProb[7] = 1;
				 m_aimProb[8] = 4;
				 m_aimProb[9] = 10;
				 m_aimProb[10] = 35;
				 */
				break;
			case 10:
				m_moveProb = 95;
				m_trackProb = 75;
				
				m_aimProb[0] = 40;
				m_aimProb[1] = 10;
				m_aimProb[2] = 0;
				m_aimProb[3] = 0;
				m_aimProb[4] = 0;
				m_aimProb[5] = 0;
				m_aimProb[6] = 0;
				m_aimProb[7] = 0;
				m_aimProb[8] = 0;
				m_aimProb[9] = 10;
				m_aimProb[10] = 40;
				/*
				 m_aimProb[0] = 40;
				 m_aimProb[1] = 8;
				 m_aimProb[2] = 1;
				 m_aimProb[3] = 1;
				 m_aimProb[4] = 0;
				 m_aimProb[5] = 0;
				 m_aimProb[6] = 0;
				 m_aimProb[7] = 1;
				 m_aimProb[8] = 1;
				 m_aimProb[9] = 8;
				 m_aimProb[10] = 40;
				 */
				break;
				
		} //end switch
	};
	
	var selectAIType = function() {
		var v = randInt(1,100);
		m_isTrackAI = v <= m_trackProb;
	};
	
	var predictPaddleCollision = function() {
		// computer player is on right so calculate movement up to the collision with right of game
		// area minus the width of the paddle
		var finalXPos = m_gameRect.x + m_gameRect.width - m_paddle.size.x;
		// FIXME: this is upside down in javascript! opengl origin starts from bottom left, canvas is top left
		
		var bottomY = m_gameRect.y + m_gameRect.height;
		var topY = m_gameRect.y;
		
		var dx = m_ball.size.x / 2;
		var dy = m_ball.size.y / 2;
		
		var xPos = m_ball.position.x; //- dx;
		var yPos = m_ball.position.y; // - dy;
		var xVel = m_ball.velocity.x;
		var yVel = m_ball.velocity.y;
		
		if(!m_isTrackAI || xVel <= 0) {
			return m_ball.position.y;
		}
		
		// simulate
		// xVel always > 0 because ball headed towards the right
		
		while(xPos < finalXPos) {
			// calculate next collision
			if(feq(yVel,0.0)) {
				break;
			}
			
			// will we collide with top or bottom before hitting the final x pos?
			var expY = yVel < 0 ? topY : bottomY;
			var t = (expY - yPos) / yVel;
			var x = xPos + t * xVel;
			
			if(x < finalXPos) {
				xPos = x;
				yPos = expY;
				yVel = -yVel;
			}
			// we hit the end first so that's where we want to go
			else {
				t = (finalXPos - xPos) / xVel;
				yPos += yVel * t;
				break;
			}

		} // while
		
		return yPos;
	};
	

	// public methods
	that.initPaddlePos = function() {
		// 1 and 100
		m_paddlePos = randInt(1,100);
		selectAIType();
	};
	
	that.getAimIndex = function() {
		var currentNum = 0, index = 0;
		
		currentNum += m_aimProb[0];
		
		while(currentNum < m_paddlePos)
		{
			index ++;
			currentNum += m_aimProb[index];
		}
		
		return index;
	};
	
	
	var calcDesiredYPos = function() {
		var start = predictPaddleCollision();
		var increment = m_paddle.size.y / 10;
		var index = that.getAimIndex();
		
		if(index < 5) {
			return Math.floor(start - (5 - index) * increment);
		}
		else if(index > 5) {
			return Math.ceil(start + (index - 5) * increment);
		}
		else {
		    return Math.round(start);
		}
	};
	
	
	that.movePaddle = function(dt) {
		// center of paddle
		//var initPos = vector(m_paddle.position.x + m_paddle.size.x / 2,m_paddle.position.y - m_paddle.size.y / 2);
		//var pos = vector(initPos.x,initPos.y);
		var pos = m_paddle.position;
		
		//set computer player movement
		var move_incr = Math.round(m_paddle.velocity.y * dt
									 * m_moveProb / 100); // * 0.75f);
		
		var direction = 0;
		
		var desiredYPos = calcDesiredYPos();
		
		//we want to move paddle down to match ball position
		if (desiredYPos > pos.y)
			direction = 1;
		//we want to move paddle up to match ball position
		else if(desiredYPos < pos.y)
			direction = -1;
		//we don't need to move the paddle
		else
			direction = 0;
		
		
		if(Math.abs(desiredYPos - pos.y) > move_incr)
			pos.y += direction * move_incr;
		else
			pos.y = desiredYPos;
		
		//make sure that m_paddle stays within the game screen boundaries
		
		var offsetY = m_paddle.clampToGameArea(m_gameRect);
		pos.y += offsetY;
		
		//console.log("pos.y=" + pos.y + ";desiredYPos=" + desiredYPos + ";move_incr=" + move_incr + ";offsetY=" + offsetY);
		
//		var hheight = m_paddle.size.y / 2;
		
//		if(pos.y - hheight < TOP_PADDING_PIXELS)
//		{
//			pos.y = TOP_PADDING_PIXELS + hheight;
//		}	
//		else if(pos.y + hheight > TOP_PADDING_PIXELS + GAME_WIN_SIZE_Y )
//		{
//			pos.y = TOP_PADDING_PIXELS + GAME_WIN_SIZE_Y - hheight;
//		}
		
//		m_paddle.position.y += pos.y - initPos.y;
		//m_paddle.position.y = pos.y + m_paddle.size.y / 2
		
		return direction;
	};
	
	
	
	
	// initialize the AI
	initAI();
	
	that.initPaddlePos();
	
	return that;
	
} // pongAI