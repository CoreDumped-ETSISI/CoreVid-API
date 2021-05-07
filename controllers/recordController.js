'use strict'

const Record = require('../models/record')
const service = require('../services')
const mongoose = require('mongoose')


function createRecord (req, res) {
  const { user } = req.body
  const { workspace } = req.body
  const { left } = req.body
  const { active } = req.body

  if (!user || !workspace) {
    return res.status(400).send({ message: 'missing params' })
  }

  const record = new Record({ user, workspace, left, active})
  record.save((err, recordStored) => {
    if (err) return res.status(500).send({ message: `Error al salvar la base de datos ${err}` })
    return res.status(200).send(record)
  })
}

function getRecordList (req, res) {
  Record.find({})
    .populate('user')
    .populate('workspace')
    .exec( (err, records) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` })
    if (records.length === 0) return res.status(404).send({ message: 'No existen registros' })
    return res.status(200).send(records)
  })
}

function getRecord (req, res) {
  const { recordId } = req.params

  Record.findById(recordId, (err, record) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!record) return res.status(404).send({ message: 'El registro no existe' })
    return res.status(200).send({ record })
  })
}

function getRecordByUser (req, res) {
  const { user } = req.params

  Record.find({user: user}, (err, record) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!record) return res.status(404).send({ message: 'No hay registros de ese usuario' })
    return res.status(200).send({ record })
  })
}

function getRecordByWorkspace (req, res) {
  const { workspace } = req.params

  Record.find({workspace: workspace}, (err, record) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!record) return res.status(404).send({ message: 'No hay registros de ese espacio de trabajo' })
    return res.status(200).send({ record })
  })
}


function deleteRecord (req, res) {
  const { recordId } = req.params

  Record.findByIdAndDelete(recordId, (err, record) => {
    if (err) return res.status(500).send({ message: `Error al borrar registro: ${err}` })
    if (!record) return res.status(404).send({ message: 'El registro no existe' })
    return res.status(200).send({ message: 'El registro ha sido borrado' })
  })
}


function isUserActive(req, res) {
  const { userId } = req.params

  Record.find({user: userId.trim(), active: true})
  .populate('user')
    .populate('workspace')
    .exec( (err, record) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!record||record.length==0) return res.status(404).send({ message: 'El usuario no tiene un espacio de trabajo activo' })
    return res.status(200).send( record[0] )
  })
}

function leaveUserActive (req, res) {
  const { userId } = req.params

  Record.findOneAndUpdate({user: userId.trim(), active: true}, {$set: {active: false}}, (err, record) => {
    if (err) return res.status(500).send({ message: `Error al realizar peticion: ${err}` })
    if (!record) return res.status(404).send({ message: 'El usuario no tiene un espacio de trabajo activo' })
    return res.status(200).send( record )
  })
}

function getActiveRecords (callback) {
  console.log('Scream')
  Record.find({active: true})
    .populate('workspace')
    .exec( (err, records) => {
      if (err) callback([])
      if (!records||records.length==0) callback([])
      return callback(records);
  })
  console.log("hasta luego maricarmen")
}

function leaveAllUsers() {
  Record.updateMany({active: true}, {$set: {active: false, left: true}}, (err, records) => {
    if (err) console.log(err)
    if (!records) console.log('No hay')
  })
}

module.exports = {
  createRecord,
  getRecordList,
  getRecord,
  getRecordByUser,
  getRecordByWorkspace,
  deleteRecord,
  isUserActive,
  leaveUserActive,
  getActiveRecords,
  leaveAllUsers
}
