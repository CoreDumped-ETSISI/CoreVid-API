'use strict'

const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

const recordController = require('../controllers/recordController')

router.post('/', auth, recordController.createRecord)
router.get('/', admin, recordController.getRecordList)
router.get('/:recordId', admin, recordController.getRecord)
router.get('/getByWorkspace/:name', admin, recordController.getRecordByWorkspace)
router.get('/getByUser/:name', admin, recordController.getRecordByUser)
router.delete('/:recordId', admin, recordController.deleteRecord)

router.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

router.get('/isAdmin', admin, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

module.exports = router