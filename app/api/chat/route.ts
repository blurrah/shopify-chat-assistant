import { NextRequest } from "next/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { systemPrompt } from "@/lib/ai";

// Helper function to wrap MCP tools and auto-parse JSON responses
function wrapMCPTools(mcpTools: Record<string, any>) {
    const wrappedTools: Record<string, any> = {};
    
    for (const [toolName, toolDef] of Object.entries(mcpTools)) {
        const originalExecute = toolDef.execute;
        wrappedTools[toolName] = {
            description: toolDef.description,
            parameters: toolDef.parameters,
            execute: async (params: any) => {
                const result = await originalExecute(params);
                
                // Check if result has the MCP format with content array
                if (result?.content && Array.isArray(result.content) && result.content[0]?.text) {
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
    const tools = wrapMCPTools(mcpTools)

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