import type { NextApiRequest, NextApiResponse } from 'next';

import { Configuration, OpenAIApi } from "openai";
import multer from 'multer';

let fs = require('fs');

type Message = {
  message: string
}

type Data = {
  result?: string;
  error?: Message
}

type Body = {
  file?: File;
  path?: string;
  text?: string
}

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
);

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const body: Body = await new Promise((resolve, reject) => {
      upload.single('image')(req as any, res as any, (err) => {
        if (err) return reject(err);
        resolve({ file: (req as any).file, path: (req as any).file?.path, text: req.body });
      })
    });

    console.log('body', body.text)

    let response;

    if (body.path) {
      response = await openai.createImageEdit(
        fs.createReadStream(body.path),
        body.text?.prompt,
        '',
        1,
        body.text?.size,
        "b64_json"
      );
    } else {
      response = await openai.createImage({
        prompt: body.text?.prompt,
        n: 1,
        size: body.text?.size,
        response_format: "b64_json"
      })
    }
    
    const base64Img = `data:image/png;base64,${response.data.data[0].b64_json}`;

    res.status(200).json({ result: base64Img });

  } catch(error: any) {
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
