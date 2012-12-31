
var myAnimationFrameId = null;

// start game button
function newPongGame() {
	var difficulty = parseInt($('#difficulty').val());
	startGame(difficulty);
}

// wire up window and animation frame stuff
$(document).ready(
		function() {
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
//			                                            callback(dt);
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
			
			
			// set up key up/key down
            window.keydown = {};
            function keyName(event) 
            {
            	// FIXME: jQuery.hotkeys not defined even though script plugin is included!
               return hotkeys.specialKeys[event.which] ||
                      String.fromCharCode(event.which).toLowerCase();
            }
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
            // end key up, key down
            
            // initial game drawing
            Game.init();
            Game.draw();
            
		}
);

function startGame(difficulty) {
	
	window.cancelAnimationFrame(myAnimationFrameId);

	Game.init(difficulty);

	doGameLoop();

}

function pausePongGame() {
	
	if(Game.paused) {
		Game.paused = false;
		doGameLoop();
	}
	else {
		window.cancelAnimationFrame(myAnimationFrameId);
		Game.paused = true;
	}
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

