import type { NextApiRequest, NextApiResponse } from 'next';

import { openai, configuration } from '../../services/openai';
import multer from 'multer';

let fs = require('fs');

type ImageSize = '256x256' | '512x512' | '1024x1024';

type ResponseData = {
  result?: string;
  error?: {
    message: string
  }
}

type Body = {
  file?: File;
  path?: string;
  text: {
    prompt: string;
    size: ImageSize;
  }
}

const upload = multer(
  { dest: "uploads/" }
);

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const input = req.body.prompt || '';
  if (input.trim().length == 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt"
      }
    })
  }

  try {
    const body: Body = await new Promise((resolve, reject) => {
      upload.single('image')(req as any, res as any, (err) => {
        if (err) return reject(err);
        resolve({ file: (req as any).file, path: (req as any).file?.path, text: req.body });
      })
    });

    let response;

    if (body.path) {
      response = await openai.createImageEdit(
        fs.createReadStream(body.path),
        body.text.prompt,
        undefined,
        1,
        body.text.size,
        "b64_json"
      );
    } else {
      response = await openai.createImage({
        prompt: body.text?.prompt,
        n: 1,
        size: body.text.size,
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
      console.error(`Error with OpenAI API request: ${error.code} ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
