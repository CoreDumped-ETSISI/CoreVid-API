'use strict'

const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

const workspaceController = require('../controllers/workspaceController')

router.post('/', admin, workspaceController.createWorkspace)
router.get('/', auth, workspaceController.getWorkspaceList)
router.get('/:workspaceId', auth, workspaceController.getWorkspace)
router.get('/getByName/:name', auth, workspaceController.getWorkspaceByName)
router.get('/available', auth, workspaceController.getAvailableWorkspaces)
router.get('/ideal', auth, workspaceController.getAvailableWorkspaces)
router.put('/:workspaceId', admin, workspaceController.updateWorkspace)
router.delete('/:workspaceId', admin, workspaceController.deleteWorkspace)

router.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

router.get('/isAdmin', admin, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

module.exports = router