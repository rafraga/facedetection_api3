    $('#video_div').html("<video id='videoel' crossorigin='anonymous' src='" + video_link + "' +  oncanplay='enablestart()' preload='auto' loop playsinline autoplay muted width='250'></video>")
    var total_frames_processed = 0
    var init_var = 0.0
    Youtube.confidence = $('#confidence').val()
    var minConfidence = Youtube.confidence
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
          
          if (parseInt(total_faces_in_frame) == parseInt(0)){
           this.result_list.push("<font size='2'><h6><b>Video time (sec):</b> " + current_time_sec + "<br><b>Faces in the frame:</b> " + total_faces_in_frame + "</font>")
           this.results_data.push(("video_time:"+current_time_sec+";faces_in_frame:"+total_faces_in_frame +"\\n"))
          } else {
            this.result_list.push("<font size='2'><h6><b>Video time (sec):</b> " + current_time_sec + "<br><b>Faces in the frame:</b> " + total_faces_in_frame + "<br><b>Faces info:</b> " + faces_info + "</font>")
          
           this.results_data.push(("video_time:"+current_time_sec+";faces_in_frame:"+total_faces_in_frame+";"+faces_info +"\\n"))  
          }
          total_frames_processed += 1

          this.result_list.push("<div style='display:inline-block'><center>")
          faceImages.forEach(function(canvas) {return this.result_list.push(canvas)})
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
          vid.pause()
          vid.remove()
          $('#spaces').html("")
          end_time = current_time_sec
          $('#header').html("<center><h5>Results</h5><h6>" + count_faces + " total faces found in video segment (from " + start_time + " to " + end_time + " seconds).<br>Total frames processed:" + total_frames_processed + "</h6><button class='btn' id='download_txt_button' style='position: center;right: 0;left: 0;margin-right: auto;margin-left: auto' value='Download Data'><h6>Download Data</h6></button>&nbsp;&nbsp;<button class='btn' id='download_image_button' style='position: center;right: 0;left: 0;margin-right: auto;margin-left: auto' value='Download Faces'><h6>Download Faces</h6></button></center>")
          console.log(results_data) // results that will go to the database
          console.log("total_faces_in_video: " + count_faces) // results that will go to the database
          $('#spaces').html("<br><br>")
          $('#spaces2').html("<br><br><br><br><br><br><br><br>")
          $("#results-view").attr("style","height:50px;width:700px;background-color:#eee;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 20em;width: 90%;text-align: left")    
          var total_faces_in_video = count_faces

        $('#download_image_button').click(function() {
          document.getElementById("results-view").style.display = "none"

          $("#faces_view").attr("style","height:40px;width:700px;background-color:#eee;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 20em;width: 100%;text-align: center")
          $("#faces_view").html(faces)
          
          html2canvas($('#all').get(0)).then(function (canvas) {
            var myImage = canvas.toDataURL()
            var link = document.createElement("a");
            var d = new Date();
            var n = d.getTime();
            link.download = "face-squared_" + n + ".png"
            link.href = myImage
            document.body.appendChild(link)
            link.click()
          })
          
         document.getElementById("results-view").style.display = "block"
        })

        $('#download_txt_button').click(function() {
            var element = document.createElement('a');
            var d = new Date();
            var n = d.getTime();
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(results_data));
            element.setAttribute('download', "face-squared_" + n + ".txt");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        })

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
    