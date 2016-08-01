var config = require('./config');
var model = require('./model');
var notify = require('./notify');
var fs = require('fs');
const db_file ='db.json';

var db = function () {};

db.prototype.init = function(){
	try {
		this.data = JSON.parse(fs.readFileSync('./'+db_file, 'utf8'));
	} catch (e) {
		console.log(e);
		notify.error.trigger('db_load_fail', db);
	}
}

db.prototype.restore = function(){
	try {
		this.data = JSON.parse(fs.readFileSync('./seed.json', 'utf8'));
		this.save();
		console.log('database has been restored with seed data')
	} catch (e) {
		console.log(e);
		notify.error.trigger('db_load_fail', db);
	}
}

db.prototype.save = function(){
	fs.writeFile('db.json', JSON.stringify(this.data), function (err, data) {
		if (err) {
			return console.log(err);
		}
	});
}

db.prototype.create = function(c, d){
	this.data[c].push(d);
	this.save();
	return d;
}

db.prototype.update = function(c, pk, d){
	if(typeof c === 'undefined'){
		notify.error.trigger('collection_required');
	}
	if (typeof model.schema.collections[c] === 'undefined'){
		notify.error.trigger('collection_invalid', c);
	}

	var k = model.schema.collections[c].pk;

	for(var i=0; i<this.data[c].length; i++){
		if(pk == this.data[c][i][k]){
			this.data[c][i] = d;
			this.save();
			return this.data[c][i];
		}
	}
}

db.prototype.delete = function(c, pk, pk_field){
	if(typeof c === 'undefined'){
		notify.error.trigger('collection_required');
	}
	if (typeof model.schema.collections[c] === 'undefined'){
		notify.error.trigger('collection_invalid', c);
	}

	pk_field = typeof pk_field !== 'undefined' ? pk_field : model.schema.collections[c].pk

	for(var i=0; i<this.data[c].length; i++){
		if(pk == this.data[c][i][pk_field]){
			this.data[c][i] = 'del'
		}
	}

	var dels = 0;
	this.data[c] = this.data[c].filter(function(a){ 
		if ('del' == a) dels++;
		else return true;
	});
	
	this.save();
	
	return dels > 0 ? dels : false;
}

db.prototype.find = function(c, q){
	if (typeof c === 'undefined'){
		notify.error.trigger('collection_required');
	}
	if (typeof model.schema.collections[c] === 'undefined'){
		notify.error.trigger('collection_invalid', c);
	}

	var result = this.data[c];
	var sort_by = false;
	var sort_type = 1 // acending;
	var pagination = config.api.pagination; // default true
	var page_size = config.api.page_size; 	// default 5
	var page = false; 	// default 5

	if (Object.keys(q).length > 0) {

		Object.keys(q).forEach(function(k) {

			if( model.schema.collections[c].fields.indexOf(k) !== -1) {
				result = result.filter(function(a){ return a[k] == q[k] });
			}

			if ('sort_by'==k) {
				if (model.schema.collections[c].fields.indexOf(q['sort_by']) !== -1) {
					sort_by = q['sort_by'];
				}
			}
			if ('sort_type'==k) {
				if ('desc' == q['sort_type'].toLowerCase()) {
					sort_type = -1; // decending
				}
			}

			if ('pagination'==k) pagination=parseInt(q['pagination']);
			if ('page_size'==k) page_size=parseInt(q['page_size']);
			if ('page'==k) page=parseInt(q['page']);

		});
	} 

	if (false !== sort_by){
		result = result.sort(function(a, b){
		    if(a[sort_by] < b[sort_by]) return (-1 * sort_type);
		    if(a[sort_by] > b[sort_by]) return (1 * sort_type);
		    return 0;
		})
	}


	if (true == pagination || false !== page) {
		if (typeof page_size=='number' && typeof page=='number') {
			var from = ( (page - 1) * page_size );
			var to = from + page_size;
			result = result.slice(from,to);
		}
	}

	return typeof result !== 'undefined' ?  result : [];
}

db.prototype.find_one = function(c, pk){
	if (typeof c === 'undefined'){
		notify.error.trigger('collection_required');
	}
	if (typeof model.schema.collections[c] === 'undefined'){
		notify.error.trigger('collection_invalid', c);
	}
	if (typeof pk === 'undefined'){
		notify.error.trigger('primarykey_required');
	}

	var k = model.schema.collections[c].pk;
	var q = {};
	q[k] = pk;

	var result = this.find(c, q);
	return Object.keys(result).length > 0 ?  result[0] : null;
}

module.exports = new db();