import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export default async function handler(req) {
  const { messages, model, analysisContext } = await req.json()

  // Use the selected model or default to GPT-3.5-turbo
  const selectedModel = model || 'gpt-3.5-turbo'

  // Ensure the context is always included
  const contextMessage = {
    role: 'system',
    content: `You are an SRE assistant. Use the following context to answer questions about the system's errors and performance: ${analysisContext}`
  }

  const fullMessages = [contextMessage, ...messages.slice(1)]

  const response = await openai.createChatCompletion({
    model: selectedModel,
    stream: true,
    messages: fullMessages
  })

  const stream = OpenAIStream(response)
  
  return new StreamingTextResponse(stream)
}