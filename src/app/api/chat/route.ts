import {Configuration, OpenAIApi} from 'openai-edge';
import { StreamingTextResponse, OpenAIStream } from 'ai';
import { NextResponse } from 'next/server';
import { Stream } from 'stream';
import { ConsoleLogWriter } from 'drizzle-orm';

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        
        const response: any = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
            stream: true
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log(error); 
    }
}

async function getTextResponse(response: any) {
    // Ensure the response body is readable and convert to text
    const textResponse = await response.body.getReader();
    let responseText = "";
    
    // Read the chunks of data from the stream
    const decoder = new TextDecoder("utf-8");
    let done = false;
    while (!done) {
      const { value, done: chunkDone } = await textResponse.read();
      done = chunkDone;
      if (value) {
        responseText += decoder.decode(value, { stream: !done });
      }
    }
    return responseText;
  }

  