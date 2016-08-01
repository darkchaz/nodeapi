var notify = function () {};

notify.prototype.error = {
	codes: {
		collection_invalid: "The collection '{}' does not exist",
		collection_required: "Must specify a collection",
		primarykey_required: "Must specify a primary key",
		document_not_found: "The document with primary key '{}' does not exist",
		document_collision: "A document with primary key '{}' already exists in the collection",
		method_invalid: "The request method '{}' is not supported",
		post_data_required: "Post data parameters are required",
		username_required: "Username is required",
		password_required: "Password is required",
		authentication_failed: "Authentication credentials failed",
		token_required: "Authorized bearer token required",
		token_invalid: "Token is invalid",
		token_expired: "Token is expired",
		json_invalid: "The supplied JSON is invalid",
		db_load_fail: "There was an error loading the database from './{}'",
		unknown: "An unknown error has occurred",
	},

	msg: function (c, o){
			var c = typeof c !== 'undefined' ?  c : false;
			var o = typeof o !== 'undefined' ?  o : false;
			if(c)
				return o ? this.codes[c].replace('{}', o) : this.codes[c];
			else
				return 'Unkown Error';
	},

	get: function(c, o){
		return this.msg(c,o);
	},

	trigger: function(c, o){
		throw new Error(this.msg(c,o));
	},
}

module.exports = new notify();
