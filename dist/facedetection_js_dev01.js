    $('#video_div').html("<video id='videoel' crossorigin='anonymous' src='" + video_link + "' +  oncanplay='enablestart()' preload='auto' loop playsinline autoplay muted width='250'></video>")
    var init_var = 0.0
    var minConfidence = prompt("Insert a confidence level between 0.1 and 0.9 (from lower to higher)", "0.6")
    if (minConfidence === null) {
      minConfidence = 0.6
    }
    let net, result
    var result_list = "none"
    var vid = document.getElementById('videoel')
    vid.setAttribute('crossorigin', 'anonymous')
    var video_progress = -1
    var faces = []
    var count_faces = 0
    var max_faces = 100
    var times_list = []
    var results_data = []
      function enablestart() {
        if (init_var == 0.0) {
          vid.currentTime = vid.duration - (vid.duration * 0.03)
          this.init_var += 1.0
        } else {
          this.init_var += 1.0
        }
       onPlay(vid)
      }
     async function onPlay(videoEl) {
      if(videoEl.paused || videoEl.ended)
        return false

      if (video_progress <= vid.currentTime){
        const input = new faceapi.NetInput(videoEl)
        const { width, height } = input
        const canvas = $('#overlay').get(0)
        canvas.width = width
        canvas.height = height

        const ts = Date.now()
        result = await net.locateFaces(input, minConfidence) 
        $('#time').val(`${(Date.now() - ts)} ms`)
        $('#fps').val(`${faceapi.round(1000 / (Date.now() - ts))}`)

        current_time = (Date.now() - ts)
        current_fps = faceapi.round(1000 / (Date.now() - ts))
        current_time_sec = vid.currentTime
        print_process = parseInt(parseFloat(((vid.duration-(((vid.duration - current_time_sec) / vid.duration)*vid.duration))/vid.duration)*100).toFixed(0))
        if (print_process < 100) {
          $('#faces_view').html('<center><h5>Processing video: ' + print_process + '' +'%</h5></center>')
        }else{
          $('#faces_view').html('')
        }
        total_faces_in_frame = Object.keys(result).length
        this.count_faces += total_faces_in_frame
        faces_info = JSON.stringify(result)
        const faceImages = await faceapi.extractFaces(input.canvases[0], result)

        //faceImages.setAttribute('crossorigin', 'anonymous')
        
        if (result_list == "none"){
          vid.currentTime = 0
          this.result_list = []
          start_time = vid.currentTime
        } else {
          this.times_list.push(parseInt(vid.currentTime))
          this.result_list.push("<font size='2'><h6><b>Video time (sec):</b> " + current_time_sec + "<br><b>Frame #:</b> " + current_fps + "<br><b>Faces in the frame:</b> " + total_faces_in_frame + "<br><b>Faces info:</b> " + faces_info + "</font>")
          this.result_list.push("<div style='display:inline-block'><center>")
          this.results_data.push(("video_time:"+current_time_sec+";frame_num:"+current_fps+";faces_in_frame:"+total_faces_in_frame+";"+faces_info))
          faceImages.forEach(function(canvas) {return this.result_list.push(canvas)})
          //faceImages.forEach(function(canvas) {if(count_faces < max_faces){return this.faces.push(canvas)}})
          faceImages.forEach(function(canvas) {return this.faces.push(canvas)})
          this.result_list.push("</center></div></h6><br><br>")
          this.video_progress = vid.currentTime

          if (document.contains(document.getElementById('startbutton'))) {
                document.getElementById('startbutton').remove()
                $('#results-view').empty()
              }

          $("#results-view").html(result_list)
          $('#results-view').scrollTop($('#results-view')[0].scrollHeight)
          setTimeout(() => onPlay(videoEl))
        }
      } else {
        vid.onplaying = function() {
          $("#faces_view").attr("style","height:40px;width:700px;background-color:#eee;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 20em;width: 50%;text-align: center")
          $("#faces_view").html(faces)
          vid.pause()
          vid.remove()
          $('#spaces').html("")
          end_time = current_time_sec
          $('#header').html("<center><h5>Results</h5><h6>" + count_faces + " faces found in video segment (from " + start_time + " to " + end_time + " seconds).</h6></center>")
          $('#spaces').html("<br><br>")
          $('#spaces2').html("<br>")
          $("#results-view").attr("style","height:50px;width:700px;background-color:#eee;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 20em;width: 90%;text-align: left")    
          var total_faces_in_video = count_faces
          console.log(results_data) // results that will go to the database
          console.log("total_faces_in_video: " + total_faces_in_video) // results that will go to the database

          // //save something in the dom to a file
          // domtoimage.toJpeg(document.getElementById('faces_view'), { quality: 0.95 })
          //   .then(function (dataUrl) {
          //       var link = document.createElement('a');
          //       link.download = 'image.jpeg';
          //       link.href = dataUrl;
          //       link.click();
          //   });


          html2canvas($('#all'), {
            onrendered: function (canvas) {
                var img = canvas.toDataURL("image/png")
                window.open(img);
            }
          });

          return results_data
        }; 
      return false
      }
    }
    async function run() {
      net = await initFaceDetectionNet()
    }

    vid.addEventListener('canplay', enablestart, false);

    $(document).ready(function() {
      run()
    })
    