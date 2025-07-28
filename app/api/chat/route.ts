import { NextRequest } from "next/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { systemPrompt } from "@/lib/ai";

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    const mcpClient = await createMCPClient({
        transport: new StreamableHTTPClientTransport(new URL(`https://${process.env.MYSHOPIFY_DOMAIN}/api/mcp`), {
           sessionId: "CHANGETHIS" 
        })
    })

    const tools = await mcpClient.tools()

    const result = streamText({
        model: "openai/gpt-4o",
        messages: convertToModelMessages(messages),
        system: systemPrompt,
        tools,
        // Allows model to do multiple tool calls and return a response when called
        stopWhen: stepCountIs(10),
        toolChoice: "auto",
        onFinish: async (result) => {
            // Close the MCP client after the stream is finished
            await mcpClient.close()
        }
    })

    return result.toUIMessageStreamResponse();
}