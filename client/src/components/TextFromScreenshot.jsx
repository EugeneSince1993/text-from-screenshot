import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const TextFromScreenshot = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [serverResponse, setServerResponse] = useState(null);

  const formData = new FormData();
  const filename = uuidv4() + '.png';

  function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

  const postScreenshot = async () => {
    const { data } = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/screenshot',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .catch(error => {
        console.log("Error: ", error);
      });
    
    return data;
  };

  const makeScreenshot = () => {
    navigator.mediaDevices.getDisplayMedia()
      .then(stream => {
        let track = stream.getVideoTracks()[0];
        let capture = new ImageCapture(track);
        capture.grabFrame()
          .then(bitmap => {
            track.stop();
              
            const canvas = document.getElementById('screenshot');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            canvas.getContext('2d').drawImage(bitmap, 0, 0);

            setImgSrc(canvas.toDataURL());
          })
      })
      .catch(e => console.log(e));
  };

  const addScreenshot = async () => {
    let file = dataURLtoFile(imgSrc, filename);
    formData.append('screenshot', file);
    const response = await postScreenshot();
    setServerResponse(response);
    console.log(response);
  };

  useEffect(() => {
    if (imgSrc) {
      addScreenshot();
    }
  }, [imgSrc]);

  return (
    <div className="text-from-screenshot">
      <h4>
        Чтобы сделать скриншот экрана, распознать текст из скриншота и получить текст с результатом, нажмите на кнопку ниже:
      </h4>
      <Button variant="contained" onClick={makeScreenshot}>Получить текст из скриншота</Button>
      <div className="image-container">
        <canvas id="screenshot"></canvas>
        {imgSrc && <img src={imgSrc} alt="screenshot" />}
      </div>
      {serverResponse && (
        <div className="word-list">
          <h4 className="word-list__description">Слова, найденные в скриншоте, разделенные запятой:</h4>
          {serverResponse.words_from_image}
        </div>
      )}
    </div>
  );
};
