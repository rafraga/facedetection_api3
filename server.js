const express = require('express')
const path = require('path')
const domtoimage = require('dom-to-image')
//const Promise = require('bluebird')
//const GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'))
const Storage = require('@google-cloud/storage');

const app = express()

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))
app.use(express.static(path.join(__dirname, './node_modules/axios/dist')))
app.use(express.static(path.join(__dirname, './node_modules/dom-to-image/dist')))

app.get('/', (req, res) => res.redirect('/face_detection_video'))
app.get('/face_detection_video', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo.html')))


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });