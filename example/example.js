/**
 * Created by FeikoLai on 5/1/15.
 */

var client = require('redis').createClient(6379, 'localhost');
var RedisTransport = require('../');
var bunyan = require('bunyan');

transport = new RedisTransport({
	container: 'logs:foo',
	client: client,
	drop_factor: 0.25,
	length:10,
	diagnosis: true
});

logger = bunyan.createLogger({
	name: 'name',
	streams: [{
		type: 'raw',
		level: 'trace',
		stream: transport
	}]
});

client.on('error',function(e){
	console.error(e);
});

transport.on('logged',function(item){
	console.log('logged');
});

transport.on('trim',function(item){
	console.log('trim',item);
});


setInterval(function(){
	logger.info('foo' + new Date());
},500);
