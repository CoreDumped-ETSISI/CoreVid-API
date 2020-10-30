'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const enumerator = require('../middlewares/enumStructures')

const WorkspaceSchema = new Schema({
    name: { type: String, required: true, unique: true, maxlength: 50 },
    priority: { type: Number, unique: true, required: true},
    available: { type: Boolean, default: true },
})

module.exports = mongoose.model('Workspace', WorkspaceSchema)