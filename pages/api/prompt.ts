import type { NextApiRequest, NextApiResponse } from 'next';
import { configuration, openai } from '../../services/openai';

type ResponseData = {
  result?: any;
  error?: {
    message: string
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

  const input = JSON.parse(req.body).input || '';
  if (input.trim().length == 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt"
      }
    })
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(input.trim()),
      temperature: 0.7,
      max_tokens: 256
    }) 

    res.status(200).json({ result: response.data.choices[0].text });

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

function generatePrompt(input: any) {
  return `The following is an input and output for a world-class, cutting edge, advanced prompt enhancer for a text to image AI that professionally adds creative details and nuances to the prompt, as well as clearly and coherently re-describes prompts put in the input. 
  Input Prompt: ${input}
  AI Output Prompt:`
}
