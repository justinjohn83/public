/**
 * New node file
 */
var http = require('http');
var assert = require('assert');

// include json
require('/Users/jmontgomery/Documents/workspace/public/PongJs/WebContent/js/lib/json2.js');

// test case execution
testPlayers();
testGameById();
testPostGameById();
testGameRequest();

function testPlayers() {
	var opts = {
	host: 'localhost',
	port: 8000,
	path: '/service/players',
	method: 'GET',
	headers: {'content-type':'application/json'}
	};
	
	
	var req = http.request(opts, function(res) {
	 	res.setEncoding('utf8');
		var data = "";
	
		res.on('data', function(d) {
			data += d;
	 	});
	 
		res.on('end', function() {
			var actual = JSON.parse(data);
			//var expected = [{name:'Justin'},{name:'Fred'}];
			
			assert.notEqual(actual,null);
			assert.strictEqual('Justin', actual[0].name);
			//assert.equal(actual,expected); 
		});
	
	});
	
	req.write('');
	req.end();
}

function testGameById() {

	var opts = {
	host: 'localhost',
	port: 8000,
	path: '/service/games/1',
	method: 'GET',
	headers: {'content-type':'application/json'}
	};
	
	
	var req = http.request(opts, function(res) {
	 	res.setEncoding('utf8');
		var data = "";
	
		res.on('data', function(d) {
			data += d;
	 	});
	 
		res.on('end', function() {
			var actual = JSON.parse(data);
			//var expected = [{name:'Justin'},{name:'Fred'}];
			
			assert.notEqual(actual,null);
			assert.strictEqual('1', actual.id);
			//assert.equal(actual,expected); 
		});
	
	});
	
	req.write('');
	req.end();
}

function testPostGameById() {
 
 	var opts = {
	host: 'localhost',
	port: 8000,
	path: '/service/games/1',
	method: 'POST',
	headers: {'content-type':'application/json'}
	};
	
	
	var req = http.request(opts, function(res) {
	 	res.setEncoding('utf8');
		var data = "";
	
		res.on('data', function(d) {
			data += d;
	 	});
	 
		res.on('end', function() {
			//var actual = JSON.parse(data);
			//var expected = [{name:'Justin'},{name:'Fred'}];
			assert.ok(data);
			//assert.notEqual(actual,null);
			//assert.strictEqual('1', actual.id);
			//assert.equal(actual,expected); 
		});
	
	});
	
	req.write('');
	req.end();

}

function testGameRequest() {
 
 	var opts = {
	host: 'localhost',
	port: 8000,
	path: '/service/game/request',
	method: 'POST',
	headers: {'content-type':'application/json'}
	};
	
	
	var req = http.request(opts, function(res) {
	 	res.setEncoding('utf8');
		var data = "";
	
		res.on('data', function(d) {
			data += d;
	 	});
	 
		res.on('end', function() {
			//var actual = JSON.parse(data);
			//var expected = [{name:'Justin'},{name:'Fred'}];
			assert.notEqual(data,null);
			//assert.notEqual(actual,null);
			//assert.strictEqual('1', actual.id);
			//assert.equal(actual,expected); 
		});
	
	});
	
	req.write('');
	req.end();

}