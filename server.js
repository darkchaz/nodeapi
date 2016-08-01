var db = require('./db');
var config = require('./config');
var app = require('./app');
var http = require('http');

if (process.argv.indexOf('--reset') !== -1) db.restore();

if (typeof process.env.KEY == 'undefined') throw new Error('Required secret key is not set in enviroment variables');

http.createServer(app).listen(config.server.port);
console.log('API running @ http://127.0.0.1:' + config.server.port);
