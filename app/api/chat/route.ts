import type { NextRequest } from "next/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { systemPrompt } from "@/lib/ai";
import { z } from "zod";

interface ToolDef {
    description: string;
    parameters: Record<string, unknown>;
    execute: (params: unknown) => Promise<McpToolOutput>;
}

// This just parses the output schema for the MCP tools pre-parsed
const mcpToolOutputSchema = z.object({
    content: z.array(z.object({
        type: z.enum(["text", "tool-call"]),
        text: z.string(),
    })),
})

type McpToolOutput = z.infer<typeof mcpToolOutputSchema>;

/**
 * Wraps Shopify MCP tools and auto-parses JSON responses
 * @param mcpTools MCP tools
 * @returns Wrapped tools
 */
function wrapMCPTools(mcpTools: Record<string, ToolDef>) {
    const wrappedTools: Record<string, ToolDef> = {};
    
    for (const [toolName, toolDef] of Object.entries(mcpTools)) {
        const originalExecute = toolDef.execute;
        wrappedTools[toolName] = {
           ...toolDef,
            execute: async (params: unknown) => {
                const result = await originalExecute(params);

                const parsedResult = mcpToolOutputSchema.safeParse(result);

                if (parsedResult.success) {
                    try {
                        // Try to parse the JSON string
                        const parsedContent = JSON.parse(result.content[0].text);
                        return parsedContent;
                    } catch (error) {
                        // If parsing fails, return the original text
                        console.warn(`Failed to parse JSON for tool ${toolName}:`, error);
                        return result.content[0].text;
                    }
                }
                
                // Return original result if not MCP format
                return result;
            }
        };
    }
    
    return wrappedTools;
}

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    const mcpClient = await createMCPClient({
        transport: new StreamableHTTPClientTransport(new URL(`https://${process.env.MYSHOPIFY_DOMAIN}/api/mcp`), {
           sessionId: "CHANGETHIS" 
        })
    })

    const mcpTools = await mcpClient.tools()
    
    // TODO: Fix typing here
    const tools = wrapMCPTools(mcpTools as unknown as Record<string, ToolDef>)

    const result = streamText({
        model: "openai/gpt-4o",
        messages: convertToModelMessages(messages),
        system: systemPrompt,
        tools,
        // Allows model to do multiple tool calls and return a response when called
        stopWhen: stepCountIs(10),
        toolChoice: "auto",
        onFinish: async () => {
            // Close the MCP client after the stream is finished
            await mcpClient.close()
        }
    })

    return result.toUIMessageStreamResponse();
}