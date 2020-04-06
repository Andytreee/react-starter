const { prefix } = require('../src/server/config.js')

const routers = {
	'GET /user': {name: '刘小夕'},
	'POST /login/account': (req, res) => {
		const { password, username } = req.body
		if (password === '888888' && username === 'admin') {
			return res.send({
				status: 'ok',
				code: 0,
				token: 'sdfsdfsdfdsf',
				data: { id: 1, name: '刘小夕' }
			})
		} else {
			return res.send({ status: 'error', code: 403 })
		}
	}
}
const AddPrefix = {}
// 增加api前缀
for(const key in routers) {
	let [ method, url ] = key.split(' ');
	url = prefix + url;
	AddPrefix[`${method} ${url}`] = routers[key]
}
module.exports = AddPrefix;
