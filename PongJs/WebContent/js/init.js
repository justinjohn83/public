$(document).ready(function() {
	// new game click handler
	$('#playGame').click(function() {
		Pong.newPongGame();
	});
	
	$('#pauseGame').click(function() {
		Pong.pausePongGame();
	});
});