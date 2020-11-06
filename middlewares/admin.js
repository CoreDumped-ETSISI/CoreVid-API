'use strict'

const services = require('../services')

function isAdmin (req, res, next) {
	if(!req.headers.authorization) {
		return res.status(403).send({message: 'No tienes autorización 1'})
	}

	const token = req.headers.authorization.split(" ")[1]
	services.decodeToken(token)
		.then(response => {
            req.user = response.sub
            if(response.role !== "admin")
                return res.status(403).send({message: 'No tienes autorización 2'})
			next()
		})
		.catch(response => {
			return res.status(403).send({message: 'No tienes autorización 3'})
		})
}

module.exports = isAdmin