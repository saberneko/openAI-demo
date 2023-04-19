import { Configuration, OpenAIApi } from "openai";
import multer from 'multer';

let fs = require('fs');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
  api: {
    bodyParser: false
  }
}

const upload = multer(
  { dest: "uploads/" }
)

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const body = await new Promise((resolve, reject) => {
      upload.single('image')(req, res, (err) => {
        if (err) return reject(err);
        resolve({ file: req.file, path: req.file?.path, text: req.body });
      })
    });

    let response;

    if (body.path) {
      response = await openai.createImageEdit(
        fs.createReadStream(body.path),
        body.text.prompt,
        '',
        1,
        "256x256"
      );
    } else {
      response = await openai.createImage({
        prompt: body.text.prompt,
        n: 1,
        size: "256x256",
      })
    }

    res.status(200).json({ result: response.data.data[0].url });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
