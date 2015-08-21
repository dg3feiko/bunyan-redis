bunyan-redis
============

Bunyan redis transport

Installation
========
```bash
npm install @aftership/bunyan-redis
```

Usage
========

With existing redis client connection.

```javascript
//normal client
var client = require('redis').createClient(); 

//sentinel client
var client = require('redis-sentinel').createClient(
[
    {host: 'SENTINEL_HOST_1', port: PORT},
    {host: 'SENTINEL_HOST_2', port: PORT}
],
masterName, 
opts)
);


var transport = new RedisTransport({
  container: 'logs:myslug',//convention `logs:subject`
  client: client,
  db: DB_INDEX
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
