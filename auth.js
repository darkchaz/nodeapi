var notify = require('./notify');
var jwt = require('./jwt');
var db = require('./db');

var auth = function () {};

auth.prototype.validate_bearer_token = function(req, res, next) {
    var bearer_token;
    var bearer_header = req.headers["authorization"];

    if (typeof bearer_header !== 'undefined') {
        var bearer = bearer_header.split(" ");
        bearer_token = bearer[1];
        req.token = bearer_token;
        req.jwt = jwt.payload(bearer_token);

        if (typeof req.jwt.username == 'undefined' || typeof req.jwt.expire == 'undefined'){
			res.statusCode = 403;
			res.errors.push( notify.error.get('token_invalid') );

        } else {

        	var users = db.find('users', {
				'username':req.jwt.username,
				'token': req.token
			});

			if (users.length > 0) {
				res.user = users[0];
				//console.log(res.user);

				var now = new Date(Date.now());
				var expire = new Date(req.jwt.expire);

	        	if (expire > now){
	        		next();

	        	} else {
					res.statusCode = 403;
					res.errors.push( notify.error.get('token_expired') );
	        	}

			} else {
				res.statusCode = 403;
				res.errors.push( notify.error.get('token_invalid') );
			}

        }
    } else {
		res.statusCode = 403;
		res.errors.push( notify.error.get('token_required') );
    }
}

module.exports = new auth();
