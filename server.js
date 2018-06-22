const html2canvas = require('html2canvas')
const express = require('express')
const path = require('path')

const app = express()

const viewsDir = path.join(__dirname, 'views')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))
app.use(express.static(path.join(__dirname, './node_modules/axios/dist')))

app.get('/', (req, res) => res.redirect('/face_detection_video'))
app.get('/face_detection_video', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo.html')))

app.get('/dev', (req, res) => res.redirect('/face_detection_video_dev'))
app.get('/face_detection_video_dev', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo_dev01.html')))


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });