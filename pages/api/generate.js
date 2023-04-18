import { Configuration, OpenAIApi } from "openai";
import multer from 'multer';

let fs = require('fs');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     })
//   })
// }

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
    // const body = await new Promise((resolve, reject) => {
    //   upload.single('upload_file')(req, res, (err) => {
    //     if (err) return reject(err);
    //     resolve({ file: req.file, path: req.file.path, text: req.body });
    //   })
    // })
    // const response = await openai.createImageEdit(
    //   fs.createReadStream(body.path),
    //   '',
    //   body.text.description,
    //   1,
    //   "256x256"
    // );
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 1,
      size: "512x512",
    })

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

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();

  return `Suggest three names for an animal that is a superhero.

      Animal: Cat
      Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
      Animal: Dog
      Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
      Animal: ${capitalizedAnimal}
      Names:`;
}

// unhandledRejection: TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received undefined
