'use strict'

const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

const userController = require('../controllers/userController')

router.post('/', userController.createUser)
router.post('/log', userController.logUser)
router.post('/getUserIdByToken', userController.getUserIdByToken)
router.get('/getById/:userId', admin, userController.getUser)
router.get('/getByName/:userName', admin, userController.getUserByName)
router.get('/getUsers/', admin, userController.getUserList)
router.put('/:userId', admin, userController.updateUser)
router.delete('/:userId', admin, userController.deleteUser)

router.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

router.get('/isAdmin', admin, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

module.exports = router
