var config = function () {};

config.prototype.server = {
	port: '1337'
}
config.prototype.api = {
	pagination: false,
	page_size: 5
}
config.prototype.settings = {
	verbose: false
}

module.exports = new config();
