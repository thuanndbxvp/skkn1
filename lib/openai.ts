import OpenAI from 'openai'

// Only initialize OpenAI if API key is available
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

// Check if OpenAI is available
export function isOpenAIAvailable(): boolean {
  return !!openai && !!process.env.OPENAI_API_KEY
}

export async function chatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    temperature?: number
    maxTokens?: number
    stream?: boolean
  }
) {
  if (!openai) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY.')
  }
  
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
  if (!openai) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY.')
  }
  
  return openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 4000,
    stream: true,
  })
}
