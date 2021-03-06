A fork from [bunyan-redis](https://github.com/harrisiirak/bunyan-redis)
============

This fork adds some features dedicated for Aftership Logger.

1. client rotation.
2. aggressive buffer trancation

Usage
========

With existing redis client connection.

```javascript
var client = redis.createClient();

var transport = new RedisTransport({
  container: 'logs',
  client: client
});

var logger = bunyan.createLogger({
  name: 'bunyan-redis',
  streams: [{
    type: 'raw',
    level: 'trace',
    stream: transport
  }]
});
```

And with connection data.

```javascript
var transport = new RedisTransport({
  container: 'logs',
  host: '127.0.0.1',
  port: 6379,
  password: 'password'
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
```

Options
========
* host - redis hostname
* port - redis port
* db - redis database index
* password - redis password
* client - redis client instance
* container - redis key

Tests
========
```bash
npm test
```
