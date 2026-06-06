import "server-only";

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const OPENAI_CHAT_MODEL = "gpt-5.5";

let openaiClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export async function createJsonChatCompletion(messages: ChatCompletionMessageParam[]): Promise<string> {
  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_CHAT_MODEL,
    response_format: { type: "json_object" },
    messages,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty content");
  }

  return content;
}

export async function createTextChatCompletion(messages: ChatCompletionMessageParam[]): Promise<string> {
  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_CHAT_MODEL,
    messages,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty content");
  }

  return content;
}
