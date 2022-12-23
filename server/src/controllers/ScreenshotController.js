import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import axios from 'axios';
import { iam_token } from './../index.js';

export const convertToText = (req, res) => {
  try {
    const file = fs.readFileSync(`./images/${req.file.filename}`);
    const fileContentInBase64 = Buffer.from(file).toString('base64');

    const textFileUniqueName = uuidv4() + ".txt";

    let words;
    
    const postData = {
      "folderId": "b1ghes9ctqpav3e6l72l",
      "analyze_specs": [{
        "content": fileContentInBase64,
        "features": [{
          "type": "TEXT_DETECTION",
          "text_detection_config": {
            "language_codes": ["*"]
          }
        }]
      }]
    };

    const makePostRequest = async () => {
      const { data } = await axios({
        method: 'post',
        url: 'https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${iam_token}`
        },
        data: postData
      })
        .then(response => {
          console.log('Post request made');
          return response;
        })
        .catch(error => {
          console.log("Error: ", error);
        });

      return data;
    };

    makePostRequest()
      .then(data => {
        const flattenArrDeep = (arr) => {
          words = _.flattenDeep(arr);
        };

        let myPromise = new Promise(function(myResolve, myReject) {
          const wordsFromImage = data.results.map(result => {
            return result.results.map(result => {
              return result.textDetection.pages.map(page => {
                return page.blocks.map(block => {
                  return block.lines.map(line => {
                    return line.words.map(word => {
                      return word.text;
                    });
                  });
                });
              });
            });
          });

          myResolve(wordsFromImage);
        });

        myPromise.then((result) => {
          flattenArrDeep(result);
        }, 
        (err) => console.log(err));

      })
      .then(() => {
        words = words.join(', ');
        fs.writeFile(`./textfiles/${textFileUniqueName}`, words, function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
        return res.json({
          message: 'Скриншот сконвертирован в текст',
          words_from_image: words
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось распознать текст на изображении'
    });
  }
};