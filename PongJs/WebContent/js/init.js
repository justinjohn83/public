$(document).ready(function() {
	// new game click handler
	$('#playGame').click(function() {
		newPongGame();
	});
	
	$('#pauseGame').click(function() {
		pausePongGame();
	});
});