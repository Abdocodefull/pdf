import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: google("gemini-2.0-flash-exp"),
    messages: convertToModelMessages(messages),
    system:
      "You are an intelligent assistant specialized in analyzing educational curricula and academic content. When a user uploads a curriculum PDF, read it carefully and provide accurate, detailed answers in English. Help students and teachers understand the content, explain concepts in a simplified way, and provide practical examples when needed. You can also create practice questions and lesson summaries.",
  })

  return result.toUIMessageStreamResponse()
}
