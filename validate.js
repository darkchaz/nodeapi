var db = require('./db');
var model = require('./model');
var jwt = require('./jwt');
var notify = require('./notify');

var validate = function () {};

validate.prototype.errors = [];
validate.prototype.data = false;


// Req object expects: collection, pk, method, data
validate.prototype.api = function(req){

	this.errors = [];

	var c = req.collection;
	var pk = req.pk;
	var m = req.method;
	var d = req.data;

	if (typeof c !== 'undefined' && c in model.schema.collections) {

		switch(req.method) {
		    case 'POST':
				var self = this;
				Object.keys(d).forEach(function(k) {
					if (k == model.schema.collections[c].pk) {
		        		if ( null !== db.find_one(c, d[k]) ){
							self.errors.push( notify.error.get('document_collision', d[k]) );
							return self.res();
		        		}
					}
				});
		    	break;

		    case 'GET':
		    case 'DELETE':
		    case 'PUT':
		    	break;

		    default:
				this.errors.push( notify.error.get('method_invalid', m) );
				//return this.res();
		}

		switch(req.collection) {
		    case 'users':
				switch(req.method) {
		    		case 'POST':
						if (typeof d.username === 'undefined')
							this.errors.push( notify.error.get('username_required') );

						if (typeof d.password === 'undefined')
							this.errors.push( notify.error.get('password_required') );

						var expire = new Date(Date.now() + 30 *24*60*60*1000);
						d.token = jwt.create({
							username: d.username,
							expire: expire
						})

						d.password = jwt.tenable_encode(d.password);
						this.data = d;
		    			break;
				}
		    	break;

		    case 'configurations':
		    	break;
		}

	} else {
		this.errors.push( notify.error.get('collection_invalid', req.collection) );
	}
	
	return this.res();
}

validate.prototype.json = function(json){

	this.errors = [];

    try {
        var o = JSON.parse(json);
        if (o && typeof o === "object") {
            return true;
        }
    }
    catch (e) { }

	this.errors.push( notify.error.get('json_invalid') );
	return this.errors.length > 0 ? {'errors': this.errors} : true;
};

validate.prototype.res = function(json){

	return this.errors.length > 0 ? {'errors': this.errors} : {'data': this.data, 'errors': false};
};

module.exports = new validate();