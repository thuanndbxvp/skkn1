import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

export async function chatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    temperature?: number
    maxTokens?: number
    stream?: boolean
  }
) {
  return openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4000,
    stream: options?.stream ?? false,
  })
}

export async function streamCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
  return openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 4000,
    stream: true,
  })
}
