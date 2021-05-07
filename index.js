const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')
const schedule = require('node-schedule')


const config = require('./config')
const userController = require('./controllers/userController')
const workspaceController = require('./controllers/workspaceController')

const port = '3003'
let server
app.set('port', port)

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)

mongoose.connect(config.MONGODB_INSTANCE, {useNewUrlParser: true}).then(
    () => {
        server = http.createServer(app)
        server.listen(port)
        server.on('error', onError)
        server.on('listening', listening)
    },
    err => {
        console.error('ERROR: connecting to Database. ' + err)
    })

function onError() {
    console.log("Error connecting DB: " + server.err)
}

function listening() {
    console.log("Connected!")
    userController.initUsers()
}

const rule = new schedule.RecurrenceRule();
rule.hour = 16;
rule.minute = 55;
rule.tz = 'Europe/Madrid';

const job = schedule.scheduleJob(rule, function(){
    workspaceController.freeAll()
});