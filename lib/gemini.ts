import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API with env key (fallback)
const envApiKey = process.env.GEMINI_API_KEY
export const genAI = envApiKey ? new GoogleGenerativeAI(envApiKey) : null

// Available Gemini Models
export const GEMINI_MODELS = {
  // ===== Gemini 3.x Series (Mới nhất 2025) =====
  'gemini-3.1-pro-preview': {
    name: 'Gemini 3.1 Pro Preview',
    description: 'Mô hình tiên tiến nhất: tư duy logic, lập luận phức tạp, coding & agentic workflows',
    maxTokens: 8192,
    badge: 'Mới nhất',
  },
  'gemini-3-flash-preview': {
    name: 'Gemini 3 Flash Preview',
    description: 'Cân bằng tối ưu giữa tốc độ phản hồi và chất lượng đầu ra',
    maxTokens: 8192,
    badge: 'Nhanh',
  },
  // ===== Gemini 2.x Series (Ổn định) =====
  'gemini-2.0-flash': {
    name: 'Gemini 2.0 Flash',
    description: 'Nhanh, ổn định, phù hợp hầu hết tác vụ',
    maxTokens: 8192,
    isRecommended: true,
  },
  'gemini-2.0-flash-lite': {
    name: 'Gemini 2.0 Flash Lite',
    description: 'Nhẹ và nhanh nhất, tiết kiệm quota',
    maxTokens: 8192,
  },
  // ===== Gemini 1.5 Series (Legacy, vẫn hoạt động) =====
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    description: 'Phiên bản cũ - nhanh, ổn định',
    maxTokens: 8192,
  },
  'gemini-1.5-flash-8b': {
    name: 'Gemini 1.5 Flash 8B',
    description: 'Phiên bản cũ - nhẹ, cho tác vụ cơ bản',
    maxTokens: 8192,
  },
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    description: 'Phiên bản cũ - chất lượng cao',
    maxTokens: 8192,
  },
}

export type GeminiModel = keyof typeof GEMINI_MODELS

export const DEFAULT_GEMINI_MODEL: GeminiModel = 'gemini-2.0-flash'

// Helper to get Gemini client (either from env or client-provided key)
function getGeminiClient(clientApiKey?: string): GoogleGenerativeAI | null {
  if (clientApiKey) {
    try {
      return new GoogleGenerativeAI(clientApiKey)
    } catch (error) {
      console.error('Error creating Gemini client with provided key:', error)
      return null
    }
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
    apiKey?: string
  }
): Promise<string> {
  try {
    const client = getGeminiClient(options?.apiKey)
    
    if (!client) {
      throw new Error('Gemini API key not configured. Please provide a valid API key.')
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
  } catch (error: any) {
    console.error('Gemini Chat Completion Error:', error)
    throw new Error(`Gemini API Error: ${error.message}`)
  }
}

// Streaming completion
export async function* geminiStreamCompletion(
  messages: { role: 'user' | 'model'; content: string }[],
  options?: {
    model?: GeminiModel
    temperature?: number
    maxTokens?: number
    apiKey?: string
  }
): AsyncGenerator<string, void, unknown> {
  try {
    const client = getGeminiClient(options?.apiKey)
    
    if (!client) {
      throw new Error('Gemini API key not configured. Please provide a valid API key.')
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
  } catch (error: any) {
    console.error('Gemini Stream Completion Error:', error)
    throw new Error(`Gemini API Error: ${error.message}`)
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
