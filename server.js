const express = require('express')
const path = require('path')
const domtoimage = require('dom-to-image')
const app = express()

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))
app.use(express.static(path.join(__dirname, './node_modules/axios/dist')))
app.use(express.static(path.join(__dirname, './node_modules/dom-to-image/dist')))

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.PORT);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.get('/', (req, res) => res.redirect('/face_detection_video'))
app.get('/face_detection_video', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo.html')))

app.get('/dev', (req, res) => res.redirect('/face_detection_video_dev'))
app.get('/face_detection_video_dev', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo_dev01.html')))


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });