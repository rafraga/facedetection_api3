const express = require('express')
const path = require('path')
// const domtoimage = require('dom-to-image')
const app = express()

const viewsDir = path.join(__dirname, 'views')

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

 app.all('/face_detection_video', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

 app.all('/face_detection_video_dev', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './weights')))
app.use(express.static(path.join(__dirname, './dist')))
app.use(express.static(path.join(__dirname, './node_modules/axios/dist')))
app.use(express.static(path.join(__dirname, './node_modules/dom-to-image/dist')))




app.post("/:url", function(req, res) {  
  url_link = req.params.url
  return url_link
})


app.get('/:url', (req, res) => res.redirect('/face_detection_video'))
app.get('/face_detection_video', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo.html')))

app.get('/dev', (req, res) => res.redirect('/face_detection_video_dev'))
app.get('/face_detection_video_dev', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetectionVideo_dev01.html')))


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });