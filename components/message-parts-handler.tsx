"use client";

import type { UIDataTypes, UIMessagePart } from "ai";
import {
	AITool,
	AIToolContent,
	AIToolHeader,
	AIToolParameters,
	AIToolResult,
} from "@/components/ui/kibo-ui/ai/tool";
import { type ChatTools, McpToolOutputSchema, shopifyToolSchemas } from "@/lib/types";
import { validateToolResult } from "@/lib/validation";
import { Cart } from "./tools/cart";
import { CartUpdate } from "./tools/cart-update";
import { PolicyFAQ } from "./tools/policy-faq";
import { ProductCatalog } from "./tools/product-catalog";

interface MessagePartsHandlerProps {
	parts: UIMessagePart<UIDataTypes, ChatTools>[];
}

export function MessagePartsHandler({ parts }: MessagePartsHandlerProps) {
	return (
		<>
			{parts.map((part, index) => {
				if (part.type === "text") {
					return <span key={part.text}>{part.text}</span>;
				}

				// Handle tool calls - the type includes the tool name
				if (part.type.startsWith("tool-")) {
					const toolName = part.type.replace("tool-", "");

					// Check if this is a streaming tool call or completed
					if ("state" in part) {
						const status =
							part.state === "output-available"
								? "completed"
								: part.state === "output-error"
									? "error"
									: "running";

						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: No nice alternative here right now
							<AITool key={index} defaultOpen>
								<AIToolHeader
									status={status}
									name={toolName}
									description={getToolDescription(toolName)}
								/>
								<AIToolContent>
									{"input" in part && part.input && (
										<AIToolParameters parameters={part.input} />
									)}
									{"output" in part &&
										part.output &&
										renderShopifyToolResult(toolName, part.output, false)}
									{"errorText" in part && part.errorText && (
										<AIToolResult error={part.errorText} />
									)}
								</AIToolContent>
							</AITool>
						);
					}
				}

				return null;
			})}
		</>
	);
}

function getToolDescription(toolName: string): string {
	const descriptions: Record<string, string> = {
		search_shop_catalog: "Searching product catalog",
		search_shop_policies_and_faqs: "Looking up store policies and FAQs",
		get_cart: "Retrieving cart contents",
		update_cart: "Updating cart items",
	};

	return descriptions[toolName] || "Running tool";
}

function renderShopifyToolResult(
	toolName: string,
	result: unknown,
	isError?: boolean,
): React.ReactNode {
	if (isError) {
		return <AIToolResult error={String(result)} />;
	}

	// Validate the result before rendering
	switch (toolName) {
		case "search_shop_catalog": {
      // TODO: Fix this scuffed double parse
			const parsedData = validateToolResult(McpToolOutputSchema, result);
			const validationResult = validateToolResult(
				shopifyToolSchemas.searchShopCatalogOutput,
				JSON.parse(parsedData.data?.content[0].text ?? "{}"),
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return (
					<AIToolResult
						error={`Invalid tool result: ${validationResult.error}`}
					/>
				);
			}
			return <ProductCatalog data={validationResult.data} />;
		}

		case "search_shop_policies_and_faqs": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.searchShopPoliciesFAQsOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return (
					<AIToolResult
						error={`Invalid tool result: ${validationResult.error}`}
					/>
				);
			}
			return <PolicyFAQ data={result} />;
		}

		case "get_cart": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.getCartOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return (
					<AIToolResult
						error={`Invalid tool result: ${validationResult.error}`}
					/>
				);
			}
			return <Cart data={result} />;
		}

		case "update_cart": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.updateCartOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return (
					<AIToolResult
						error={`Invalid tool result: ${validationResult.error}`}
					/>
				);
			}
			return <CartUpdate data={result} />;
		}

		default:
			return (
				<AIToolResult result={<pre>{JSON.stringify(result, null, 2)}</pre>} />
			);
	}
}
