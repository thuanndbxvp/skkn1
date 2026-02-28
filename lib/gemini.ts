import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

// Available Gemini Models
export const GEMINI_MODELS = {
  'gemini-2.0-flash': {
    name: 'Gemini 2.0 Flash',
    description: 'Nhanh, hiệu quả, phù hợp hầu hết tác vụ',
    maxTokens: 8192,
  },
  'gemini-2.0-flash-lite': {
    name: 'Gemini 2.0 Flash Lite',
    description: 'Nhẹ, rẻ nhất, phù hợp tác vụ đơn giản',
    maxTokens: 8192,
  },
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    description: 'Cân bằng tốc độ và chất lượng',
    maxTokens: 8192,
  },
  'gemini-1.5-flash-8b': {
    name: 'Gemini 1.5 Flash 8B',
    description: 'Nhẹ, nhanh cho tác vụ cơ bản',
    maxTokens: 8192,
  },
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    description: 'Chất lượng cao nhất, phức tạp',
    maxTokens: 8192,
  },
}

export type GeminiModel = keyof typeof GEMINI_MODELS

export const DEFAULT_GEMINI_MODEL: GeminiModel = 'gemini-2.0-flash'

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  return !!genAI && !!apiKey
}

// Non-streaming completion
export async function geminiChatCompletion(
  messages: { role: 'user' | 'model'; content: string }[],
  options?: {
    model?: GeminiModel
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured')
  }

  const modelName = options?.model || DEFAULT_GEMINI_MODEL
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 4096,
    },
  })

  // Convert messages to Gemini format
  // Gemini uses 'user' and 'model' roles (not 'system', 'assistant')
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }))

  const lastMessage = messages[messages.length - 1]

  const chat = model.startChat({
    history: history.length > 0 ? history : undefined,
  })

  const result = await chat.sendMessage(lastMessage.content)
  const response = result.response
  return response.text()
}

// Streaming completion
export async function* geminiStreamCompletion(
  messages: { role: 'user' | 'model'; content: string }[],
  options?: {
    model?: GeminiModel
    temperature?: number
    maxTokens?: number
  }
): AsyncGenerator<string, void, unknown> {
  if (!genAI) {
    throw new Error('Gemini API key not configured')
  }

  const modelName = options?.model || DEFAULT_GEMINI_MODEL
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 4096,
    },
  })

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }))

  const lastMessage = messages[messages.length - 1]

  const chat = model.startChat({
    history: history.length > 0 ? history : undefined,
  })

  const result = await chat.sendMessageStream(lastMessage.content)

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) {
      yield text
    }
  }
}

// Convert OpenAI message format to Gemini format
export function convertOpenAIMessagesToGemini(
  messages: { role: string; content: string }[]
): { role: 'user' | 'model'; content: string }[] {
  return messages.map((msg) => {
    // System messages become user messages in Gemini
    if (msg.role === 'system') {
      return { role: 'user', content: `[System Instructions]\n${msg.content}` }
    }
    // Assistant becomes model
    if (msg.role === 'assistant') {
      return { role: 'model', content: msg.content }
    }
    // User stays user
    return { role: 'user', content: msg.content }
  })
}
