// Unified AI Service - Supports both OpenAI and Gemini
import { openai, DEFAULT_MODEL as DEFAULT_OPENAI_MODEL } from './openai'
import {
  genAI,
  geminiChatCompletion,
  geminiStreamCompletion,
  convertOpenAIMessagesToGemini,
  GEMINI_MODELS,
  DEFAULT_GEMINI_MODEL,
  type GeminiModel,
} from './gemini'
import OpenAI from 'openai'

export type AIProvider = 'openai' | 'gemini'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AICompletionOptions {
  provider?: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// Default provider from env (Gemini is now the default)
export const DEFAULT_PROVIDER: AIProvider =
  (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'gemini'

// Check which providers are available
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = []

  if (process.env.OPENAI_API_KEY) {
    providers.push('openai')
  }

  if (process.env.GEMINI_API_KEY && genAI) {
    providers.push('gemini')
  }

  return providers
}

// Check if a provider is available
export function isProviderAvailable(provider: AIProvider): boolean {
  return getAvailableProviders().includes(provider)
}

// Get default model for a provider
export function getDefaultModel(provider: AIProvider): string {
  if (provider === 'gemini') {
    return process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
  }
  return process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL
}

// Get available models for a provider
export function getAvailableModels(provider: AIProvider): Record<string, { name: string; description: string; maxTokens?: number }> {
  if (provider === 'gemini') {
    return GEMINI_MODELS
  }
  // OpenAI models
  return {
    'gpt-4o': {
      name: 'GPT-4o',
      description: 'Chất lượng cao nhất',
      maxTokens: 4096,
    },
    'gpt-4o-mini': {
      name: 'GPT-4o Mini',
      description: 'Nhanh, rẻ, chất lượng tốt (khuyến nghị)',
      maxTokens: 4096,
    },
    'gpt-4-turbo': {
      name: 'GPT-4 Turbo',
      description: 'Cân bằng chất lượng và giá',
      maxTokens: 4096,
    },
    'gpt-3.5-turbo': {
      name: 'GPT-3.5 Turbo',
      description: 'Nhanh, giá rẻ',
      maxTokens: 4096,
    },
  }
}

// Unified chat completion (non-streaming)
export async function aiChatCompletion(
  messages: AIMessage[],
  options?: AICompletionOptions
): Promise<string> {
  const provider = options?.provider || DEFAULT_PROVIDER

  if (provider === 'gemini') {
    if (!isProviderAvailable('gemini')) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY.')
    }
    const geminiMessages = convertOpenAIMessagesToGemini(messages)
    return geminiChatCompletion(geminiMessages, {
      model: (options?.model as GeminiModel) || DEFAULT_GEMINI_MODEL,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    })
  }

  // OpenAI
  if (!isProviderAvailable('openai')) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY.')
  }

  if (!openai) {
    throw new Error('OpenAI client not initialized.')
  }

  const response = await openai.chat.completions.create({
    model: options?.model || DEFAULT_OPENAI_MODEL,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4000,
    stream: false,
  })

  return response.choices[0]?.message?.content || ''
}

// Unified streaming completion
export async function* aiStreamCompletion(
  messages: AIMessage[],
  options?: AICompletionOptions
): AsyncGenerator<string, void, unknown> {
  const provider = options?.provider || DEFAULT_PROVIDER

  if (provider === 'gemini') {
    if (!isProviderAvailable('gemini')) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY.')
    }
    const geminiMessages = convertOpenAIMessagesToGemini(messages)
    yield* geminiStreamCompletion(geminiMessages, {
      model: (options?.model as GeminiModel) || DEFAULT_GEMINI_MODEL,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
    })
    return
  }

  // OpenAI
  if (!isProviderAvailable('openai')) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY.')
  }

  if (!openai) {
    throw new Error('OpenAI client not initialized.')
  }

  const stream = await openai.chat.completions.create({
    model: options?.model || DEFAULT_OPENAI_MODEL,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4000,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      yield content
    }
  }
}

// For API routes that need OpenAI-compatible streaming
export async function aiStreamCompletionForAPI(
  messages: AIMessage[],
  options?: AICompletionOptions
): Promise<ReadableStream> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiStreamCompletion(messages, options)) {
          controller.enqueue(encoder.encode(chunk))
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
