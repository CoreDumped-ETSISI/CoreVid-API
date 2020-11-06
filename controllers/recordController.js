'use strict'

const Record = require('../models/record')
const service = require('../services')


function createRecord (req, res) {
  const { user } = req.body
  const { workspace } = req.body
  const { left } = req.body

  if (!user || !workspace) {
    return res.status(400).send({ message: 'missing params' })
  }

  const record = new Record({ user, workspace, left})
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

module.exports = {
  createRecord,
  getRecordList,
  getRecord,
  getRecordByUser,
  getRecordByWorkspace,
  deleteRecord,
}
