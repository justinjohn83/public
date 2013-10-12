var player = function() {
	var that = {};
	that.name = "Player";
	that.score = 0;
	that.id = -1;
	that.model = physicsObject();
	
	return that;
};

var pongBall = function() {

	var that = {};
	that.model = physicsObject();
};

var physicsObject = function() {

	var that = {};
	
	that.position = vector();
	that.velocity = vector();
	that.maxVelocity = vector();
	that.size = vector();
	
	that.boundingBox = function() {
    	
    	return rect2D(this.position.x,this.position.y,this.size.x,this.size.y);
    };
	
	return that;

};

var GameEventType = {
	Player_Moved : 1,
	Player_Scored : 2,
	Ball_Updated : 3,
	Player_Ready : 4,
	Game_Over : 5,
	Game_Interrupted : 6

};

// TODO: rename to GameEvent
var gameStateEvent = function() {
	var that = {};
	
	that.gameId = -1;
	that.updateDt = null;
	that.eventType = null;
	that.game = null;
	that.initiatorPlayerId = null;


};

var gameEventListener = function() {

	var that = {};
	
	that.onPlayerMoved = function(gameEvent,player) {}
	that.onPlayerScored = function(gameEvent,player) {}
	that.onBallUpdated = function(gameEvent,pongBall) {}
	that.onPlayerReady = function(gameEvent,player) {}
	that.onGameOver = function(gameEvent,game) {}
	that.onGameInterrupted = function(gameEvent,game) {}

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