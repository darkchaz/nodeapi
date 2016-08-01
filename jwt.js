var jwt = function () {};

jwt.prototype.header = {
	"alg": "TENABLE",
	"typ": "JWT"
}

jwt.prototype.payload = function(t){

	t = t.split('.');

	var h = t[0];
	var p = t[1];
	var s = t[2];

	var unsigned_token = h + '.' + p;

	var signature = new Buffer(s, 'base64').toString();
	var test_signature = this.tenable_encode(unsigned_token);

	//console.log('signature1', signature, typeof signature, signature.length);
	//console.log('signature2', test_signature, typeof test_signature, test_signature.length);

	if (signature == '"'+test_signature+'"') {
		return JSON.parse(new Buffer(p, 'base64').toString());
	} else {
		return false;
	}

}

jwt.prototype.create = function(payload){
	var h = new Buffer( JSON.stringify(this.header) ).toString('base64');
	var p = new Buffer( JSON.stringify(payload) ).toString('base64');

	var unsigned_token = h + '.' + p;
	var signature = this.tenable_encode(unsigned_token) ;

	var s = new Buffer( JSON.stringify(signature) ).toString('base64');

	var token = h + '.' + p + '.' + s;

	return token;

}

jwt.prototype.tenable_encode = function(s,k){
	var k = typeof k === 'undefined' ? process.env.KEY : k;
	var s1 = new Buffer(k).toString('hex');
	var s2 = new Buffer(k).toString('base64');
	var hash = s1 + s + k + s2;
	return new Buffer(hash).toString('hex');
}

jwt.prototype.tenable_decode = function(s,k){
	var k = typeof k === 'undefined' ? process.env.KEY : k;
	var s = new Buffer(s, 'hex').toString();
	var s1 = new Buffer(k).toString('hex');
	var s2 = new Buffer(k).toString('base64');
	s = s.substr(s1.length);
	s = s.substring(0, s.length - s2.length - k.length);
	return s;
}


module.exports = new jwt();
