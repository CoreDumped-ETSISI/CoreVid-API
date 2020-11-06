'use strict'

const services = require('../services')

function isAuth (req, res, next) {
	if(!req.headers.authorization) {
		return res.status(403).send({message: 'No tienes autorización 4'})
	}

	const token = req.headers.authorization.split(" ")[1]
	services.decodeToken(token)
		.then(response => {
			req.user = response.sub
			next()
		})
		.catch(response => {
			return res.status(403).send({message: 'No tienes autorización 5'})
		})
}

module.exports = isAuth