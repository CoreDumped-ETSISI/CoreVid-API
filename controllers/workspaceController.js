'use strict'

const Workspace = require('../models/workspace')
const recordController = require('../controllers/recordController')
const service = require('../services')


function createWorkspace (req, res) {
  const { name } = req.body
  const { priority } = req.body

  if (!name || !priority ) {
    return res.status(400).send({ message: 'missing params' })
  }

  const workspace = new Workspace({ name, priority})
  workspace.save((err, workspaceStored) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    return res.status(200).send(workspace)
  })
}

function getWorkspaceList (req, res) {
  Workspace.find({}, (err, workspaces) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` })
    if (workspaces.length === 0) return res.status(404).send({ message: 'No existen espacios de trabajo' })
    return res.status(200).send(workspaces)
  })
}

function getWorkspace (req, res) {
  const { workspaceId } = req.params

  Workspace.findById(workspaceId, (err, workspace) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!workspace) return res.status(404).send({ message: 'El espacio de trabajo no existe' })
    return res.status(200).send({ workspace })
  })
}

function getWorkspaceByName (req, res) {
  const { name } = req.params

  Workspace.find({name: name}, (err, workspace) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!workspace) return res.status(404).send({ message: 'El espacio de trabajo no existe' })
    return res.status(200).send({ workspace })
  })
}

function getAvailableWorkspaces(req, res) {
  Workspace.find({available: true}, (err, workspace) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!workspace) return res.status(404).send({ message: 'No hay espacios libres' })
    return res.status(200).send({ workspace })
  })
}

function getOccupiedWorkspaces(req, res) {
  Workspace.find({available: false}, (err, workspace) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!workspace) return res.status(404).send({ message: 'No hay espacios ocupados' })
    return res.status(200).send({ workspace })
  })
}

function getIdealWorkspace(req, res) {
  var findQuery = Workspace.find({available: true}).sort('priority').limit(1);

  findQuery.exec( (err, workspace) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!workspace) return res.status(404).send({ message: 'No hay espacios libres' })
    return res.status(200).send( workspace[0] )
  })
}

function updateWorkspace (req, res) {
  const updated = req.body
  const { workspaceId } = req.params

  Workspace.findByIdAndUpdate(workspaceId, updated, (err, oldWorkspace) => {
    if (err) return res.status(500).send({ message: `Error al actualizar espacio de trabajo: ${err}` })
    return res.status(200).send({ oldWorkspace })
  })
}

function reserveWorkspace (req, res) {
  const { available } = req.body
  const { workspaceId } = req.params

  Workspace.findByIdAndUpdate(workspaceId, {$set: {available: available}}, (err, oldWorkspace) => {
    if (err || oldWorkspace.available == false) return res.status(500).send({ message: `Error al actualizar espacio de trabajo: ${err}` })
    return res.status(200).send({ oldWorkspace })
  })
}

function deleteWorkspace (req, res) {
  const { workspaceId } = req.params

  Workspace.findByIdAndDelete(workspaceId, (err, workspace) => {
    if (err) return res.status(500).send({ message: `Error al borrar espacio de trabajo: ${err}` })
    if (!workspace) return res.status(404).send({ message: 'El espacio de trabajo no existe' })
    return res.status(200).send({ message: 'El espacio de trabajo ha sido borrado' })
  })
}

function freeWorkspace (req, res) {
  const { workspaceId } = req.params

  Workspace.findByIdAndUpdate(workspaceId, {$set: {available: true}}, (err, oldWorkspace) => {
    if (err) return res.status(500).send({ message: `Error al actualizar espacio de trabajo: ${err}` })
    return res.status(200).send({ oldWorkspace })
  })

  //must update record too
}

function vacateWorkspace(workspaceId) {
  Workspace.findByIdAndUpdate(workspaceId, {$set: {available: true}}, (err, oldWorkspace) => {
    if (err) console.log('Error '+err)
    else console.log(oldWorkspace)
  })
}

function freeAll () {
    var records

    recordController.getActiveRecords((value) => {
      records = value
      if(records !== undefined && records.length > 0) {
        for (var i = 0; i < records.length; i++) {
          console.log('Hola '+i)
          console.log(records[i])
          console.log(records[i].workspace._id)
          var id = records[i].workspace._id
          vacateWorkspace(id)
        }
        recordController.leaveAllUsers()
      }
    })
}

module.exports = {
  createWorkspace,
  getWorkspaceList,
  getWorkspace,
  getWorkspaceByName,
  getAvailableWorkspaces,
  getIdealWorkspace,
  updateWorkspace,
  deleteWorkspace,
  reserveWorkspace,
  freeWorkspace,
  getOccupiedWorkspaces,
  freeAll
}
