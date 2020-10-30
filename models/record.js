'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const enumerator = require('../middlewares/enumStructures')

const RecordSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' , required: true},
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true},
    left: { type: Boolean, required: true},
    creation: { type: Date, default: Date.now(), required: true,}
})

module.exports = mongoose.model('Record', RecordSchema)