/**
 * Created by FeikoLai on 2/1/15.
 */
var RedisTransport = require('../');
var bunyan = require('bunyan');

var transport = new RedisTransport({
	container: 'logs',
	host: '192.168.59.103',
	port: 6379,
	db: 0
});

var logger = bunyan.createLogger({
	name: 'bunyan-redis',
	streams: [{
		type: 'raw',
		level: 'trace',
		stream: transport
	}]
});


logger.warn('hello');
