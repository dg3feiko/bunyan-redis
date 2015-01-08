/**
 * Created by FeikoLai on 5/1/15.
 */
var RedisTransport = require('../index');
var bunyan = require('bunyan');
var _ = require('lodash');


var topics = _.map(_.range(100), function (num) {
	return 'topic' + num
});

var loggers = _.map(topics, function (t) {
	var client = require('redis').createClient(6379, '130.211.130.39');

	var transport = new RedisTransport({
		container: 'logs:'+t,
		client: client,
		drop_factor: 0.25,
		length:1000
	});
	var logger = bunyan.createLogger({
		name: 'test_name',
		streams: [{
			type: 'raw',
			level: 'trace',
			stream: transport
		}]
	});

	return logger;
});

_.forEach(loggers,function(logger){

	logger.warn("msg: "+new Date());
	//setTimeout(function(){
	//	//var times = _.random(0,100);
	//	//
	//	//for(var i = 0;i<times;i++)
	//	//{
	//	logger.warn("msg: " + new Date());
	//	//}
	//},8000);
});
