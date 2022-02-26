import React, {useRef, useEffect} from 'react';
import './App.css';

function App() {
  var density = 'Ñ@#W$9876543210?!abc;:+=-,._                  '
  //var density = '@%#*+=-:.     '
  
  var videoRef = useRef(null)
  var canvasRef = useRef(null)
  var asciiDivRef = useRef(null)
  var changeButton = useRef(null)

  var videoWidth = 64
  var videoHeight = 48

  var upscaledVideoWidth = 640
  var upscaledVideoHeight = 480

  useEffect(() => {
    getVideo()
    canvasRef.current.style.width = upscaledVideoWidth + "px"
    canvasRef.current.style.height = upscaledVideoHeight + "px"
    startDrawing()
  }, [asciiDivRef])

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: videoWidth, height: videoHeight } })
      .then(stream => {
        videoRef.current.srcObject = stream
      })
      .catch(err => {
        console.error(err)
        alert("Device not found or permission denied.")
      });
  };

  function startDrawing() {
    setInterval(() => {
      var context = canvasRef.current.getContext("2d")
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight)

      let image = context.getImageData(0, 0, videoWidth, videoHeight)
      let data = image.data

      var asciiImage = ""

      for (let i = 0; i < data.length; i = i + 4) {
        let r = data[i + 0]
        let g = data[i + 1]
        let b = data[i + 2]
        let avg = (r + g + b) / 3
        data[i + 0] = data[i + 1] = data[i + 2] = avg
        
        let densityIndex = Math.floor(mapBetweenRange(avg, 0, 255, density.length, 0))
        let c = density.charAt(densityIndex)

        if (i % (videoWidth*4) === 0 && i !== 0) {
          asciiImage += "<br/>"
        }

        if (c === " ")
          asciiImage += "&nbsp;"
        else
          asciiImage += c
      }

      asciiDivRef.current.innerHTML = asciiImage
      context.putImageData(image, 0, 0)
    }, 10)
  }

  function changeMode() {
    if (asciiDivRef.current.classList.contains("hide")) {
      asciiDivRef.current.classList.remove("hide")
      canvasRef.current.classList.add("hide")
      changeButton.current.innerHTML = "Change to Gray Scale"
    }else {
      asciiDivRef.current.classList.add("hide")
      canvasRef.current.classList.remove("hide")
      changeButton.current.innerHTML = "Change to ASCII"
    }
  }

  function mapBetweenRange(number, min, max, newMin, newMax) {
    return (number - min) * (newMax - newMin) / (max - min) + newMin;
  }
  
  return (
    <>
      <video ref={videoRef} width={videoWidth} height={videoHeight} autoPlay style={{display: "none"}}></video>
      <div className='main-container'>
        <h1 className='main-header'>ASCII Webcam</h1>
        <canvas ref={canvasRef} className='grayscale-img-container' width={videoWidth} height={videoHeight}></canvas>
        <div ref={asciiDivRef} className='ascii-img-container hide' style={{width: upscaledVideoWidth, height: upscaledVideoHeight}}></div>
        <button ref={changeButton} className='change-button' onClick={changeMode}>Change to ASCII</button>
        <div className='contact-container'>
          <a href="https://www.linkedin.com/in/yigitakca/"><i className="fa-brands fa-linkedin linkedin-icon"></i></a>
          <a href="https://github.com/yeetakca"><i className="fa-brands fa-github-square"></i></a>
        </div>
      </div>
    </>
  );
}

export default App;