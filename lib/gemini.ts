import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API with env key (fallback)
const envApiKey = process.env.GEMINI_API_KEY
export const genAI = envApiKey ? new GoogleGenerativeAI(envApiKey) : null

// Available Gemini Models (Confirmed working models only)
export const GEMINI_MODELS = {
  // Gemini 2.0 Series (Stable and recommended)
  'gemini-2.0-flash': {
    name: 'Gemini 2.0 Flash',
    description: 'Nhanh, hiệu quả, phù hợp hầu hết tác vụ (Khuyến nghị)',
    maxTokens: 8192,
    isRecommended: true,
  },
  'gemini-2.0-flash-lite': {
    name: 'Gemini 2.0 Flash Lite',
    description: 'Nhẹ, rẻ nhất, phù hợp tác vụ đơn giản',
    maxTokens: 8192,
  },
  'gemini-2.0-pro-exp-02-05': {
    name: 'Gemini 2.0 Pro (Exp)',
    description: 'Thử nghiệm - Chất lượng cao cho tác vụ phức tạp',
    maxTokens: 8192,
    isExperimental: true,
  },
  // Gemini 1.5 Series (Stable)
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    description: 'Chất lượng cao, phù hợp tác vụ phức tạp',
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
}

export type GeminiModel = keyof typeof GEMINI_MODELS

export const DEFAULT_GEMINI_MODEL: GeminiModel = 'gemini-2.0-flash'

// Helper to get Gemini client (either from env or client-provided key)
function getGeminiClient(clientApiKey?: string): GoogleGenerativeAI | null {
  if (clientApiKey) {
    return new GoogleGenerativeAI(clientApiKey)
  }
  return genAI
}

// Check if Gemini is available (either env or client key)
export function isGeminiAvailable(clientApiKey?: string): boolean {
  if (clientApiKey) return true
  return !!genAI && !!envApiKey
}

// Non-streaming completion
export async function geminiChatCompletion(
  messages: { role: 'user' | 'model'; content: string }[],
  options?: {
    model?: GeminiModel
    temperature?: number
    maxTokens?: number
    apiKey?: string // Client-provided API key
  }
): Promise<string> {
  const client = getGeminiClient(options?.apiKey)
  
  if (!client) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY or provide an API key.')
  }

  const modelName = options?.model || DEFAULT_GEMINI_MODEL
  const model = client.getGenerativeModel({
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
    apiKey?: string // Client-provided API key
  }
): AsyncGenerator<string, void, unknown> {
  const client = getGeminiClient(options?.apiKey)
  
  if (!client) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY or provide an API key.')
  }

  const modelName = options?.model || DEFAULT_GEMINI_MODEL
  const model = client.getGenerativeModel({
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
