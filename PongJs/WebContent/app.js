/**
 * New node file
 */
/**
 * New node file
 */
var express = require('express');
var app = express();
// use body parsing
app.use(express.bodyParser());

// use memory session storing
var store  = new express.session.MemoryStore;
// use cookie parsing
app.use(express.cookieParser());
// initialize a static secret for sessions
app.use(express.session({ secret: 'something', store: store }));

// run server on port 8000
app.listen(8000);

// TODO:
var players = [{name:'Justin'},{name:'Fred'}];
var games = {1:{id:'1'}};

app.get('/service/players', function(req, res) {
	res.send(players);
});

// dynamic url : e.g. /service/games/1
app.get('/service/games/:id', function(req, res) {
	var game = games[req.params.id];
	res.send(game);
});

app.post('/service/games/:id', function(req, res) {
	var result = {status:'OK',message:request.param.id};
	res.send(result);
});

app.post('/service/game/request',function(req,res) {
	var result = "1";
	res.send(result);
});
