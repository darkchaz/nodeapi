var db = require('./db');
var config = require('./config');
var notify = require('./notify');
var auth = require('./auth');
var jwt = require('./jwt');
var validate = require('./validate');
var url = require('url');

module.exports = function(req, res) {
	db.init();

	if (req.url === '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end();
		return;
	}

	req.url = url.parse(req.url, true);
    req.path_parts = (req.url.pathname).split('/');
    req.collection = req.path_parts[1] || false;
    req.pk = req.path_parts[2] || false;
    req.query = req.url.query;
    req.body = '';

    const verbose_mode = (typeof req.query.verbose !== 'undefined') ? true : config.settings.verbose;

	req.on('error', function(err) {
		console.error(err);

	}).on('data', function(chunk) {
		req.body += chunk;

	}).on('end', function() {
		res.on('error', function(err) {
			res.statusCode = 500;
			console.error(err);
		});

		res.setHeader('Content-Type', 'application/json');
		res.statusCode = 200;
		res.errors = [];
		res.body = {};
		var data = [];

		if(req.collection) {
			if ('auth' === req.collection){
				switch(req.method) {
					case 'GET':
						auth.validate_bearer_token(req, res, function(){
	        				data = {
	        					'username':req.jwt.username,
	        					'token':req.token
	        				}
						});
						break;

	        		case 'POST':
    					var valid_json = validate.json(req.body);
						if ( true === valid_json ){
							req.data = JSON.parse(req.body);

		        			if (typeof req.data.username == 'undefined') {
								res.statusCode = 400;
		        				res.errors.push( notify.error.get('username_required') );

		        			} else if (typeof req.data.password == 'undefined'){
								res.statusCode = 400;
		        				res.errors.push( notify.error.get('password_required') );

		        			} else {
		        				var username = req.data.username;
		        				var password = jwt.tenable_encode(req.data.password);

		        				var users = db.find('users', {
		        					'username':username,
		        					'password':password
		        				});

		        				if (users.length > 0) {
		        					var user = users[0];
					        		var expire = new Date(Date.now() + 30 *24*60*60*1000);

									user.token = jwt.create({
										username: username,
										expire: expire
									})

		        					db.update('users', username, user);
		        					data = {'token':user.token};

		        				} else {
									res.statusCode = 403;
		        					res.errors.push( notify.error.get('authentication_failed') );
		        				}
		        			}

						} else {
							res.statusCode = 400;
							res.errors.push.apply( res.errors,  valid_json.errors);
						}
	        			break;

	        		case 'DELETE':
						auth.validate_bearer_token(req, res, function(){
	        				var users = db.find('users', {
	        					'username':req.jwt.username,
	        					'token':req.token
	        				});

	        				if (users.length > 0) {
	        					var user = users[0];
	        					user.token = false;
	        					db.update('users', user.username, user);
	        					data = {'token':user.token};

	        				} else {
								res.statusCode = 403;
	        					res.errors.push( notify.error.get('authentication_failed') );
	        				}
						});
						/*
    					var valid_json = validate.json(req.body);
						if ( true === valid_json ){
							req.data = JSON.parse(req.body);

		        			if (typeof req.data.username == 'undefined') {
								res.statusCode = 400;
		        				res.errors.push( notify.error.get('username_required') );

		        			} else if (typeof req.data.token == 'undefined'){
								res.statusCode = 400;
		        				res.errors.push( notify.error.get('token_required') );

		        			} else {
		        				var username = req.data.username;
		        				var token = req.data.token;

		        				var users = db.find('users', {
		        					'username':username,
		        					'token':token
		        				});

		        				if (users.length > 0) {
		        					var user = users[0];
		        					user.token = false;
		        					db.update('users', username, user);
		        					data = {'token':user.token};

		        				} else {
									res.statusCode = 403;
		        					res.errors.push( notify.error.get('authentication_failed') );
		        				}
		        			}

						} else {
							res.statusCode = 400;
							res.errors.push.apply( res.errors,  valid_json.errors);
						}
						*/
	        			break;

				    default:
						res.statusCode = 400;
						res.errors.push( notify.error.get('method_invalid', req.method) );
				}
			} else {

				auth.validate_bearer_token(req, res, function(){
					switch(req.method) {

		    			case 'GET':
			    			if (false === req.pk) {
		        				data = db.find(req.collection, req.query);

		        			} else {
		        				data = db.find_one(req.collection, req.pk);

		        				if (null === data) {
									res.statusCode = 404;
									res.errors.push( notify.error.get('document_not_found', req.pk) );
		        				}
		        			}
		        			break;


		        		case 'POST':
		        		case 'PUT':
		        			if (('POST'==req.method && false===req.pk) || ('PUT'==req.method && false!==req.pk) ) {

								if ( req.body.length > 0) {
									var valid_json = validate.json(req.body);

									if ( true === valid_json ){
										req.data = JSON.parse(req.body);

										var validation = validate.api({
											collection: req.collection, 
											pk: req.pk,
											method: req.method, 
											data: req.data
										});

										if ( false === validation.errors ){
											req.data = false === validation.data ? req.data : validation.data;
											if ('POST'==req.method){
			        							data = db.create(req.collection, req.data);
											} else {
			        							data = db.update(req.collection, req.pk, req.data);
											}
											delete data.password;
										
										} else {
											res.statusCode = 400;
											res.errors.push.apply( res.errors,  validation.errors);
										}
									
									} else {
										res.statusCode = 400;
										res.errors.push.apply( res.errors,  valid_json.errors);
									}

								} else {
									res.statusCode = 400;
									res.errors.push( notify.error.get('post_data_required') );
								}

							} else {
								res.statusCode = 400;
								res.errors.push( notify.error.get('method_invalid', req.method) );
							}
		        			break;


		        		case 'DELETE':
		        			if (false===req.pk) {
								if ( req.body.length > 0) {
			    					var valid_json = validate.json(req.body);
									if ( true === valid_json ){
										req.data = JSON.parse(req.body);

										for (var pk_field in req.data) break;
				        				
				        				var del = db.delete(req.collection, req.data[pk_field], pk_field);
				        				data = {'deleted': del}

									} else {
										res.statusCode = 400;
										res.errors.push.apply( res.errors,  valid_json.errors);
									}
								} else {
									res.statusCode = 400;
									res.errors.push( notify.error.get('post_data_required') );
								}

		        			} else {
		        				var del = db.delete(req.collection, req.pk) !== false ? true : false
				        		data = {'deleted': del}
		        			}
							break;


					    default:
							res.statusCode = 400;
							res.errors.push( notify.error.get('method_invalid', req.method) );
		        	}
				})
	        }

		} else {
			auth.validate_bearer_token(req, res, function(){
				data = db.data;
				data.token = req.token;
			});
		}

  		if(typeof data !== 'object'){
			res.statusCode = 400;
			res.errors.push( notify.error.get('unknown') );
  		}

		if (true === verbose_mode){
			res.body.request = { headers: req.headers, method: req.method, collection: req.collection, primary_key: req.pk, query: req.query };
			res.body.response = { status: res.statusCode, errors: res.errors };
			res.body.data = data;

		} else {
			if( 200 === res.statusCode){
				res.body = data;
			} else {
				res.body.response = { status: res.statusCode, errors: res.errors };
			}
		}

		res.end(JSON.stringify(res.body));

	});


	//})
}