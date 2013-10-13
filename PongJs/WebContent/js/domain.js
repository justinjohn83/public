
// private functions
function getContext() {
	var c = document.getElementById("gameCanvas");
	var ctx = c.getContext("2d");
	return ctx;
}

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

var PointLocation = {
		Inside : 0,
		Left : 1,
		Bottom : 2,
		Right : 3,
		Top : 4
};

var GameAttributes = (function() {
	
	function GameAttributes() {
		this.collisionType = CollisionType.None;
		this.gameEvent = null;
	}
	
	return GameAttributes;
}());




var Player = (function() {
	
	function Player() {
		this.name = "Player";
		this.score = 0;
		this.id = -1;
	}
	
	return Player;
}());

var GameState = (function() {
	
	function GameState() {
		this.leftPlayer = new Player();
		this.rightPlayer = new Player();
		this.state = PlayState.NewGame;
		this.attributes = new GameAttributes();
	}
	
	return GameState;
}());

// rgb
var Color = (function() {
	function Color() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
	}
	
	return Color;
	
}());



var Vector = (function() {
	function Vector(x,y) {
		if(x !== undefined && y !== undefined) {
			this.x = x;
			this.y = y;
		}
		// assuming copy constructor
		else if(x !== undefined) {
			this.x = x.x;
			this.y = x.y;
		}
		// default constructor
		else {
			this.x = 0;
			this.y = 0;
		}
	}
	
	return Vector;
}());

var Shape = (function () {
	
	function Shape() {
		this.color = new Color();		
		this.position = new Vector();
		this.velocity = new Vector();
		this.maxVelocity = new Vector();
		this.size = new Vector();
	}
	

    
    Shape.prototype.update = function(dt) {
    	// make sure that we don't exceed max this.velocity
    	var vx = this.velocity.x;
    	var vy = this.velocity.y;
    	var mvx = this.maxVelocity.x;
    	var mvy = this.maxVelocity.y;
    	
    	if(Math.abs(vx) > mvx) {
    		if(vx >= 0) {
    			this.velocity.x = mvx;
    		}
    		else {
    			this.velocity.x = -mvx;
    		}

    	}
    	if(Math.abs(vy) > mvy) {
    		if(vy >= 0) {
    			this.velocity.y = mvy;
    		}
    		else {
    			this.velocity.y = -mvy;
    		}
    	}
    };
    
    Shape.prototype.boundingBox = function() {
    	
    	return new Rect2D(this.position.x,this.position.y,this.size.x,this.size.y);
    };
    
    return Shape;
	
}());


var Paddle = (function() {
	
	function Paddle() {
		// call super constructor
		Shape.call(this);
		
		this.canMoveUp = true;
		this.canMoveDown = true;
		this.size.x = Game.PADDLE_WIDTH;
		this.size.y = Game.PADDLE_LENGTH;
	}
	// subclass Shape by making Paddle's prototype an instance of a Shape
	Paddle.prototype = new Shape();
    
    Paddle.prototype.draw = function() {
    	var context = getContext();
    	context.strokeStyle = '#000000';
    	context.fillStyle = '#000000';
    	
    	context.beginPath();
    	// draw rectangle centered at position with fixed size
    	context.fillRect(this.position.x,this.position.y,this.size.x,this.size.y);
    	context.closePath();

    	
    };
    
    // return > 0 if can't move up, < 0 if can't move down and 0 if can move in both directions
    Paddle.prototype.clampToGameArea = function(gameArea) {
    	// make a copy
    	gameArea = new Rect2D(gameArea.x,gameArea.y,gameArea.width,gameArea.height);
    	
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
    
    return Paddle;
}());
//extends Shape

var Ball = (function() {
	
	function Ball() {
		// call super constructor
		Shape.call(this);
		
		this.size.x = Game.BALL_SIZE;
		this.size.y = Game.BALL_SIZE;
	}
	
	// subclass Shape by making Ball's prototype an instance of a Shape
	Ball.prototype = new Shape();
	
    Ball.prototype.draw = function() {
    	// draw circle
    	//var prevStroke = this.context.strokeStyle;
    	var context = getContext();
    	context.strokeStyle = '#FF0000';
    	context.fillStyle = '#FF0000';
    	context.beginPath();
    	context.arc(this.position.x,this.position.y,this.size.x,0,2*Math.PI);
    	context.closePath();
    	context.fill();
    	
    	//this.context.strokeStyle = prevStroke;
    };
    
    // must override bounding box: circle shape position is the center
    // the rectangle shape position is upper left hand corner
    Ball.prototype.boundingBox = function() {
    	
    	return new Rect2D(this.position.x - this.size.x / 2,
    			      this.position.y - this.size.y / 2,
    			      this.size.x,
    			      this.size.y);
    };
    
    return Ball;
})();


var Rect2D = (function() {
	
	function Rect2D(x,y,width,height) {
		if(typeof x !== undefined) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}
		else {
			this.x = this.y = this.width = this.height = 0;
		}
	}	

	
	Rect2D.prototype.intersects = function(r) {
		//http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
		return this.x < r.x + r.width &&
		       this.x + this.width > r.x &&
		       this.y < r.y + r.height &&
		       this.y + this.height > r.y;
			
    };
    
    Rect2D.prototype.clampPoint = function(pt) {
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
   
   Rect2D.prototype.getMinX = function() {
    	return this.x;
    };
    
    Rect2D.prototype.getMinY = function() {
    	return this.y;
    };
    
    Rect2D.prototype.getMaxX = function() {
    	return this.x + this.width;
    };
    Rect2D.prototype.getMaxY = function() {
    	return this.y + this.height;
    };
    
    Rect2D.prototype.getCenter = function() {
    	return new Vector(this.x + this.width / 2,
    				  this.y + this.height / 2);
    };
    
    Rect2D.prototype.getCenterX = function() {
    	return this.getCenter().x;
    };
    
    Rect2D.prototype.getCenterY = function() {
    	return this.getCenter().y;
    };
	
    return Rect2D;
	
})();
