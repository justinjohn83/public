
// Global game loop functions
var Pong = (function() {
	
	var that = {};
	
	var myAnimationFrameId = null;

// start game button
that.newPongGame = function newPongGame() {
	var difficulty = parseInt($('#difficulty').val(),10);
	startGame(difficulty);
};

that.pausePongGame = function pausePongGame() {
	
	if(Game.paused) {
		Game.paused = false;
		doGameLoop();
	}
	else {
		window.cancelAnimationFrame(myAnimationFrameId);
		Game.paused = true;
	}
};

function startGame(difficulty) {
	
	window.cancelAnimationFrame(myAnimationFrameId);

	Game.init(difficulty);

	doGameLoop();

}

function doGameLoop() {
	 var lastTimeLoop = new Date().getTime();
	 
	 (function gameloop(dt)
	  {
		 var currentTimeLoop = new Date().getTime();
		 // ms to s
		 var dt = (currentTimeLoop - lastTimeLoop) / 1000;
		 
		 //console.log("dt=" + dt);
		 
		 lastTimeLoop = currentTimeLoop;
		 
		 if(Game.paused) {
			 cancelAnimationFrame(myAnimationFrameId);
		 }
		 else {
		     var continueGame = Game.update(dt);
		     if(!continueGame) {
		    	 cancelAnimationFrame(myAnimationFrameId);
		    	 Game.paused = true;
		    	 alert("Game Over: " + Game.state.leftPlayer.name + " " + Game.state.leftPlayer.score + " - " + Game.state.rightPlayer.name + " " + Game.state.rightPlayer.score);
		    	 
		     }
		     else {
			     Game.draw();
			     myAnimationFrameId = requestAnimationFrame(gameloop);
		     }
		 }
	  })();
}

function initAnimationLoop() {
	//var game = new Game();

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) 
	{
	   window.requestAnimationFrame = window[vendors[x]+
	                                  'RequestAnimationFrame'];
	   window.cancelRequestAnimationFrame = window[vendors[x]+
	                                        'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
	{
	   var f = function(callback, element) 
	           {
	              var currTime = new Date().getTime();
	              var timeToCall = Math.max(0, 16-(currTime-lastTime));
	              // timeToCall is in ms -> convert to s to pass to callback for a "dt"
	              //var dt = timeToCall / 1000;
	              var id = window.setTimeout(function() 
	                                         { 
//	                                            callback(dt);
	            	  							callback(currTime+timeToCall);
	                                         }, timeToCall);
	              lastTime = currTime+timeToCall;
	              return id;
	           };
	   window.requestAnimationFrame = f;
	}

	if (!window.cancelAnimationFrame) {
	   window.cancelAnimationFrame = function(id) 
	                                 {
	                                    clearTimeout(id);
	                                 };
	}
	
	
	bindEventHandlers();
    
    // initial game drawing
    Game.init();
    Game.draw();
}

function bindEventHandlers() {
	// set up key up/key down
    window.keydown = {};
    function keyName(event) 
    {
    	// FIXME: jQuery.hotkeys not defined even though script plugin is included!
       return hotkeys.specialKeys[event.which] ||
              String.fromCharCode(event.which).toLowerCase();
    }
    
    // key events
    $(document).bind("keydown", function(event) 
                                {
                                   keydown[keyName(event)] = true;
                                   if(keydown.up) {
                                	   Game.upPressed = true;
                                   }
                                   if(keydown.down) {
                                	   Game.downPressed = true;
                                   }
                                });
    $(document).bind("keyup", function(event) 
                              {
                                 keydown[keyName(event)] = false;
                                 if(!keydown.up) {
                              	   Game.upPressed = false;
                                 }
                                 if(!keydown.down) {
                              	   Game.downPressed = false;
                                 }
                              });
    
    var lastTouchPos = null;
    	
    var processMove = function(pos) {
    	
      	// position is relative to listener element: the canvas
    	
    	// get viewport coords of paddle
    	var paddlePos = Game.leftPaddle.position; //Game.toScreenCoordinates(Game.leftPaddle.position);
    	
    	//console.log("pos=" + pos.y + ";paddlePos=" + paddlePos.y);
    	
    	// compare y coords
    	var currentY = pos.y;
    	var paddleY = paddlePos.y;
    	
    	if(Math.abs(currentY - paddleY) < 2) {
    		Game.upPressed = Game.downPressed = false;
    	}
    	else {
    		if(currentY < paddleY) {
    			Game.upPressed = true;
    		}
    		else {
    			Game.downPressed = true;
    		}
    	}
    	
    	// compare to last position for "off" detection
    	if(lastTouchPos) {
    		if(currentY < lastTouchPos.y) {
    			Game.downPressed = false;
    		}
    		else if(currentY > lastTouchPos.y) {
    			Game.upPressed = false;
    		}
    	}
    	
    	lastTouchPos = pos;
    	
    };
    
    var processTouch = function(event) {
    	// get viewport coords of touch
    	var touch =  event.touches[0];
    	
    	var pos = vector(touch.pageX,touch.pageY);
    	
    	processMove(pos);
    };
    
//    $(document).bind("touchmove",function(event) {
//    	processTouch(event);
//    });
//	$(document).bind("touchstart",function(event) {
//    	processTouch(event);
//	});
    var canvas = document.getElementById('gameCanvas');
    
    // touch events
    canvas.addEventListener('touchmove', function(event) {
    	processTouch(event);
    });
    
    canvas.addEventListener('touchstart', function(event) {
    	processTouch(event);
    });
    
    canvas.addEventListener('touchend',function(event) {
    	Game.upPressed = Game.downPressed = false;
    });
    
    // mouse events
    var mouseDown = false;
    
    canvas.addEventListener('mousedown',function(event) {
    	mouseDown = true;
    });
	canvas.addEventListener('mouseup',function(event) {
		mouseDown = false;
	});
	canvas.addEventListener('mousemove',function(event) {
		if(mouseDown) {
        	var pos = vector(event.pageX,event.pageY);
        	
        	processMove(pos);
		}
	});
	
	///////////// End event listeners ////////////////////
}

	//wire up window and animation frame stuff
	$(document).ready(initAnimationLoop);
	
	return that;
})(); // Pong
