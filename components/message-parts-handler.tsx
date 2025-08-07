"use client";

import type { UIDataTypes, UIMessagePart } from "ai";
import {
	AITool,
	AIToolContent,
	AIToolHeader,
	AIToolParameters,
	AIToolResult,
} from "@/components/ui/kibo-ui/ai/tool";
import { type ChatTools, shopifyToolSchemas } from "@/lib/types";
import { validateToolResult } from "@/lib/validation";
import { Cart } from "./tools/cart";
import { CartUpdate } from "./tools/cart-update";
import { PolicyFAQ } from "./tools/policy-faq";
import { ProductCarousel } from "./tools/product-carousel";
import { ProductDetails } from "./ecom-ui/product-details";
import { Markdown } from "./markdown";

/**
 * Responsible for rendering UI for the message parts.
 */
export function MessagePartsHandler({
	parts,
	sendMessage,
	isDebug,
}: {
	parts: UIMessagePart<UIDataTypes, ChatTools>[];
	sendMessage: (message: { text: string }) => void;
	isDebug: boolean;
}) {
	return (
		<div className="space-y-4">
			{parts.map((part, index) => {
				if (part.type === "text") {
					return <Markdown key={part.text}>{part.text}</Markdown>;
				}

				// Handle tool calls - the type includes the tool name
				if (part.type === "dynamic-tool") {
					const toolName = part.toolName;

					// Check if this is a streaming tool call or completed
					const status =
						part.state === "output-available"
							? "completed"
							: part.state === "output-error"
								? "error"
								: "running";

					const isCompleted = status === "completed";
					const hasOutput = part.output !== undefined;

					// Check if this is an internal tool call by looking at the input parameters
					const isInternal =
						"input" in part &&
						part.input &&
						typeof part.input === "object" &&
						part.input !== null &&
						"internal" in part.input &&
						part.input.internal === true;

					// Skip rendering internal tool calls entirely (unless in debug mode)
					if (isInternal && !isDebug) {
						return null;
					}

					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: No nice alternative here right now
						<div key={index}>
							{/* Used for debugging tool calls */}
							{isDebug && (
								<AITool defaultOpen={false}>
									<AIToolHeader
										status={status}
										name={toolName}
										description={getToolDescription(toolName)}
									/>
									<AIToolContent>
										{/* Messy code, need to fix this */}
										{"input" in part &&
											(part.input ? (
												<AIToolParameters
													parameters={part.input as Record<string, unknown>}
												/>
											) : null)}
										{"output" in part &&
											(part?.output ? (
												<AIToolResult
													result={JSON.stringify(part.output, null, 2)}
												/>
											) : null)}
										{"errorText" in part &&
											(part.errorText ? (
												<AIToolResult error={part.errorText} />
											) : null)}
									</AIToolContent>
								</AITool>
							)}

							{/* The actual UI components - skip for internal calls */}
							{isCompleted &&
								hasOutput &&
								!isInternal &&
								renderToolUIComponent(toolName, part.output, sendMessage)}
						</div>
					);
				}

				return null;
			})}
		</div>
	);
}

function getToolDescription(toolName: string): string {
	const descriptions: Record<string, string> = {
		search_shop_catalog: "Searching product catalog",
		search_shop_policies_and_faqs: "Looking up store policies and FAQs",
		get_cart: "Retrieving cart contents",
		update_cart: "Updating cart items",
		get_product_details: "Getting product details",
	};

	return descriptions[toolName] || "Running tool";
}

function renderToolUIComponent(
	toolName: string,
	result: unknown,
	sendMessage: (message: { text: string }) => void,
): React.ReactNode {
	// Validate the result before rendering with a clean switch handler
	switch (toolName) {
		case "search_shop_catalog": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.searchShopCatalogOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return null;
			}
			return <ProductCarousel data={validationResult.data} sendMessage={sendMessage} />;
		}

		case "search_shop_policies_and_faqs": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.searchShopPoliciesFAQsOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return null;
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
				return null;
			}
			return <Cart data={validationResult.data} />;
		}

		case "update_cart": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.updateCartOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return null;
			}
			return <CartUpdate data={validationResult.data} />;
		}

		case "get_product_details": {
			const validationResult = validateToolResult(
				shopifyToolSchemas.getProductDetailsOutput,
				result,
			);
			if (!validationResult.success) {
				console.warn(`Invalid ${toolName} result:`, validationResult.error);
				return null;
			}
			return (
				<ProductDetails
					data={validationResult.data}
					sendMessage={sendMessage}
				/>
			);
		}

		default:
			// Don't render anything for unknown tools
			return null;
	}
}
