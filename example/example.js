/**
 * Created by FeikoLai on 5/1/15.
 */

var client = require('redis').createClient(6379, '192.168.59.103');
var RedisTransport = require('../');
var bunyan = require('bunyan');

transport = new RedisTransport({
	container: 'logs',
	client: client,
	drop_factor: 0.25,
	length:1000
});

logger = bunyan.createLogger({
	name: 'name',
	streams: [{
		type: 'raw',
		level: 'trace',
		stream: transport
	}]
});



//transport.on('logged',function(item){
//	console.log('logged');
//});

//transport.on('trim',function(item){
//	console.log('trim',item);
//});


setInterval(function(){
	logger.info('foo' + new Date());
	if(Math.random() > 0.5)
	{
		logger.info('bar' + new Date());
	}
},200);
