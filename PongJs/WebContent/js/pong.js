
/*
var game = new Game();

 (function gameloop()
  {
     game.update();
     requestAnimationFrame(gameloop);
     game.draw();
  })();
 */      
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
                                        });
            $(document).bind("keyup", function(event) 
                                      {
                                         keydown[keyName(event)] = false;
                                      });
            // end key up, key down
			
			Game.init();

			 var lastTimeLoop = new Date().getTime();
			 
			 (function gameloop(dt)
			  {
				 var currentTimeLoop = new Date().getTime();
				 // ms to s
				 var dt = (currentTimeLoop - lastTimeLoop) / 1000;
				 lastTimeLoop = currentTimeLoop;
				 
			     Game.update(dt);
			     Game.draw();
			     requestAnimationFrame(gameloop);
			  })();
			//alert(game.state);
		}
);

