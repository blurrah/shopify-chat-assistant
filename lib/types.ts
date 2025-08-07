import type { UIDataTypes, UIMessage } from "ai";
import { z } from "zod";

/**
 * TODO:
 * - Add error handling with discriminated unions to tool output schema's
 */

export const messageMetadataSchema = z.object({
	createdAt: z.string(),
});

export const McpToolOutputSchema = z.object({
	content: z.array(
		z.object({
			type: z.enum(["text", "tool-call"]),
			text: z.string(),
		}),
	),
});

// Product schema
const productSchema = z.object({
	product_id: z.string(),
	title: z.string(),
	variants: z
		.array(
			z.object({
				variant_id: z.string(),
				title: z.string(),
				price: z.string(),
				currency: z.string(),
				image_url: z.string().optional(),
			}),
		)
		.optional(),
	url: z.string().optional(),
	image_url: z.string().optional(),
	description: z.string().optional(),
	price_range: z
		.object({
			currency: z.string(),
			max: z.string(),
			min: z.string(),
		})
		.optional(),
});

// Cart item schema
const cartItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	quantity: z.number(),
	price: z.number(),
	currency: z.string().optional(),
	variantId: z.string().optional(),
	imageUrl: z.string().optional(),
});

// Updated cart item schema (for updates)
const updatedCartItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	quantity: z.number(),
	action: z.enum(["added", "updated", "removed"]).optional(),
	previousQuantity: z.number().optional(),
});

// Input schemas
const searchQueryInputSchema = z.object({
	query: z.string(),
});

const cartIdInputSchema = z.object({
	cartId: z.string().optional(),
});

const updateCartInputSchema = z.object({
	cartId: z.string().optional(),
	items: z.array(
		z.object({
			variantId: z.string(),
			quantity: z.number(),
		}),
	),
});

const getProductDetailsInputSchema = z.object({
	productId: z.string(),
});

// Output schemas
const searchShopCatalogOutputSchema = z.object({
	products: z.array(productSchema),
});

const searchShopPoliciesFAQsOutputSchema = z.object({
	answer: z.string(),
	type: z.enum(["policy", "faq"]).optional(),
	title: z.string().optional(),
	category: z.string().optional(),
});

const shopifyCartSchema = z.object({
	id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	lines: z.array(
		z.object({
			id: z.string(),
			quantity: z.number(),
			cost: z.object({
				total_amount: z.object({
					amount: z.string(),
					currency: z.string(),
				}),
				subtotal_amount: z.object({
					amount: z.string(),
					currency: z.string(),
				}),
			}),
			merchandise: z.object({
				id: z.string(),
				title: z.string(),
				product: z.object({
					id: z.string(),
					title: z.string(),
				}),
			}),
		}),
	),
	delivery: z.record(z.string(), z.any()),
	discounts: z.record(z.string(), z.any()),
	gift_cards: z.array(z.any()),
	cost: z.object({
		total_amount: z.object({
			amount: z.string(),
			currency: z.string(),
		}),
		subtotal_amount: z.object({
			amount: z.string(),
			currency: z.string(),
		}),
		total_tax_amount: z
			.object({
				amount: z.string(),
				currency: z.string(),
			})
			.optional(),
	}),
	total_quantity: z.number(),
	checkout_url: z.string(),
});

const getCartOutputSchema = z.object({
	instructions: z.string(),
	cart: shopifyCartSchema,
	errors: z.array(z.string()),
});

const updateCartOutputSchema = z.object({
	instructions: z.string(),
	cart: shopifyCartSchema,
	errors: z.array(z.record(z.string(), z.string())),
});

const getProductDetailsOutputSchema = z.object({
	instructions: z.string(),
	product: z.object({
		product_id: z.string(),
		title: z.string(),
		description: z.string(),
		url: z.string(),
		image_url: z.string(),
		images: z.array(
			z.object({
				url: z.string(),
				alt_text: z.string().nullable(),
			}),
		),
		options: z.array(
			z.object({
				name: z.string(),
				values: z.array(z.string()),
			}),
		),
		price_range: z.object({
			min: z.string(),
			max: z.string(),
			currency: z.string(),
		}),
		selectedOrFirstAvailableVariant: z.object({
			variant_id: z.string(),
			title: z.string(),
			price: z.string(),
			currency: z.string(),
			image_url: z.string(),
			available: z.boolean(),
		}),
	}),
});

// Tool schemas
const searchShopCatalogToolSchema = z.object({
	input: searchQueryInputSchema,
	output: searchShopCatalogOutputSchema,
});

const searchShopPoliciesFAQsToolSchema = z.object({
	input: searchQueryInputSchema,
	output: searchShopPoliciesFAQsOutputSchema,
});

const getCartToolSchema = z.object({
	input: cartIdInputSchema,
	output: getCartOutputSchema,
});

const updateCartToolSchema = z.object({
	input: updateCartInputSchema,
	output: updateCartOutputSchema,
});

const getProductDetailsToolSchema = z.object({
	input: getProductDetailsInputSchema,
	output: getProductDetailsOutputSchema,
});

// Export individual schemas for validation
export const shopifyToolSchemas = {
	product: productSchema,
	cartItem: cartItemSchema,
	updatedCartItem: updatedCartItemSchema,
	searchShopCatalogOutput: searchShopCatalogOutputSchema,
	searchShopPoliciesFAQsOutput: searchShopPoliciesFAQsOutputSchema,
	getCartOutput: getCartOutputSchema,
	updateCartOutput: updateCartOutputSchema,
	getProductDetailsOutput: getProductDetailsOutputSchema,
};

// Inferred types
export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type UpdatedCartItem = z.infer<typeof updatedCartItemSchema>;
export type SearchShopCatalogOutput = z.infer<
	typeof searchShopCatalogOutputSchema
>;
export type SearchShopPoliciesFAQsOutput = z.infer<
	typeof searchShopPoliciesFAQsOutputSchema
>;
export type GetCartOutput = z.infer<typeof getCartOutputSchema>;
export type UpdateCartOutput = z.infer<typeof updateCartOutputSchema>;
export type GetProductDetailsOutput = z.infer<
	typeof getProductDetailsOutputSchema
>;

// Tool types (for AI SDK compatibility)
type SearchShopCatalogTool = z.infer<typeof searchShopCatalogToolSchema>;
type SearchShopPoliciesFAQsTool = z.infer<
	typeof searchShopPoliciesFAQsToolSchema
>;
type GetCartTool = z.infer<typeof getCartToolSchema>;
type UpdateCartTool = z.infer<typeof updateCartToolSchema>;
type GetProductDetailsTool = z.infer<typeof getProductDetailsToolSchema>;

export type ChatTools = {
	search_shop_catalog: SearchShopCatalogTool;
	search_shop_policies_and_faqs: SearchShopPoliciesFAQsTool;
	get_cart: GetCartTool;
	update_cart: UpdateCartTool;
	get_product_details: GetProductDetailsTool;
};

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>;
