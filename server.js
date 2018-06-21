const express = require('express')
const path = require('path')
// const cors = require('cors');
// const domtoimage = require('dom-to-image')
const app = express()
const viewsDir = path.join(__dirname, 'views')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
})

// app.get('/', function (req, res) { 
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.sendFile(path.join(viewsDir, 'faceDetectionVideo.html'))
// });

app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))
app.use(express.static(path.join(__dirname, './node_modules/axios/dist')))
app.use(express.static(path.join(__dirname, './node_modules/dom-to-image/dist')))

app.get('/', (req, res) => res.redirect('/face_detection_video'))
app.get('/face_detection_video', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo.html')))

app.get('/dev', (req, res) => res.redirect('/face_detection_video_dev'))
app.get('/face_detection_video_dev', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo_dev01.html')))

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });