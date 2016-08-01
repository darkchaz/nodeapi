var model = function () {};

model.prototype.schema = {
	collections: {
		auth: {
			pk : 'username',
			fields: [
				'username',
				'password',
				'token'
			]
		},
		users: {
			pk : 'username',
			fields: [
				'username',
				'password',
				'token'
			]
		},
		configurations: {
			pk : 'name',
			fields: [
			'name',
			'hostname',
			'port',
			'username'
			]
		}
	}
}

module.exports = new model();