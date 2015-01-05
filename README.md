bunyan-redis
============

Bunyan redis transport

Installation
========
```bash
npm install bunyan-redis
```

Usage
========

With existing redis client connection.

```javascript
var client = redis.createClient(); //or any other redis client, e.g. sentinel-ready one

var transport = new RedisTransport({
  container: 'logs:myslug',//convention `logs:subject`
  client: client
});

var logger = bunyan.createLogger({
  name: 'bunyan-redis',
  streams: [{
    type: 'raw',
    level: 'trace',
    stream: transport,
    length: 10000,
    drop_factor: 0.1
  }]
});
```

And with connection data.

Options
========
* host - redis hostname
* port - redis port
* db - redis database index
* password - redis password
* client - redis client instance
* container - redis key
* length: maximum size of log queue
* drop_factor (optional): by which overflown logs are dropped, default = 0
