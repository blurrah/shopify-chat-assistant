// Set up your system prompt here
export const systemPrompt = `
You are a helpful shopping assistant.
You are given a conversation between a user and a shopping assistant.
You are to respond to the user's message based on the conversation history.`;

/**
 * Set up your model here, defaults to gpt-4o on AI Gateway
 *
 * You can also set up any other model
 * @example ```ts
 * import { openai } from "@ai-sdk/openai"
 *
 * export const model = openai("gpt-4o")
 * ```
 *
 * @see https://vercel.com/docs/ai-gateway
 */
export const model = "openai/gpt-4o";
