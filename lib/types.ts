import { UIDataTypes, UIMessage } from "ai";
import { z } from "zod";

export const messageMetadataSchema = z.object({
    createdAt: z.string(),
})

export const McpToolOutputSchema = z.object({
    content: z.array(z.object({
        type: z.enum(['text', 'tool-call']),
        text: z.string(),
    }))
})

// Product schema
const productSchema = z.object({
    product_id: z.string(),
    title: z.string(),
    variants: z.array(z.object({
        variant_id: z.string(),
        title: z.string(),
        price: z.string(),
        currency: z.string(),
        image_url: z.string().optional(),
    })),
    url: z.string().optional(),
    imageUrl: z.string().optional(),
    description: z.string().optional(),
})

// Cart item schema
const cartItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    quantity: z.number(),
    price: z.number(),
    currency: z.string().optional(),
    variantId: z.string().optional(),
    imageUrl: z.string().optional(),
})

// Updated cart item schema (for updates)
const updatedCartItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    quantity: z.number(),
    action: z.enum(['added', 'updated', 'removed']).optional(),
    previousQuantity: z.number().optional(),
})

// Input schemas
const searchQueryInputSchema = z.object({
    query: z.string(),
})

const cartIdInputSchema = z.object({
    cartId: z.string().optional(),
})

const updateCartInputSchema = z.object({
    cartId: z.string().optional(),
    items: z.array(z.object({
        variantId: z.string(),
        quantity: z.number(),
    })),
})

// Output schemas
const searchShopCatalogOutputSchema = z.object({
    products: z.array(productSchema),
})

const searchShopPoliciesFAQsOutputSchema = z.object({
    answer: z.string(),
    type: z.enum(['policy', 'faq']).optional(),
    title: z.string().optional(),
    category: z.string().optional(),
})

const getCartOutputSchema = z.object({
    id: z.string(),
    items: z.array(cartItemSchema),
    totalQuantity: z.number().optional(),
    totalPrice: z.number().optional(),
    currency: z.string().optional(),
    checkoutUrl: z.string().optional(),
})

const updateCartOutputSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    cartId: z.string().optional(),
    updatedItems: z.array(updatedCartItemSchema).optional(),
    totalItems: z.number().optional(),
    checkoutUrl: z.string().optional(),
})

// Tool schemas
const searchShopCatalogToolSchema = z.object({
    input: searchQueryInputSchema,
    output: searchShopCatalogOutputSchema,
})

const searchShopPoliciesFAQsToolSchema = z.object({
    input: searchQueryInputSchema,
    output: searchShopPoliciesFAQsOutputSchema,
})

const getCartToolSchema = z.object({
    input: cartIdInputSchema,
    output: getCartOutputSchema,
})

const updateCartToolSchema = z.object({
    input: updateCartInputSchema,
    output: updateCartOutputSchema,
})

// Export individual schemas for validation
export const shopifyToolSchemas = {
    product: productSchema,
    cartItem: cartItemSchema,
    updatedCartItem: updatedCartItemSchema,
    searchShopCatalogOutput: searchShopCatalogOutputSchema,
    searchShopPoliciesFAQsOutput: searchShopPoliciesFAQsOutputSchema,
    getCartOutput: getCartOutputSchema,
    updateCartOutput: updateCartOutputSchema,
}

// Inferred types
export type Product = z.infer<typeof productSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type UpdatedCartItem = z.infer<typeof updatedCartItemSchema>
export type SearchShopCatalogOutput = z.infer<typeof searchShopCatalogOutputSchema>
export type SearchShopPoliciesFAQsOutput = z.infer<typeof searchShopPoliciesFAQsOutputSchema>
export type GetCartOutput = z.infer<typeof getCartOutputSchema>
export type UpdateCartOutput = z.infer<typeof updateCartOutputSchema>

// Tool types (for AI SDK compatibility)
type SearchShopCatalogTool = z.infer<typeof searchShopCatalogToolSchema>
type SearchShopPoliciesFAQsTool = z.infer<typeof searchShopPoliciesFAQsToolSchema>
type GetCartTool = z.infer<typeof getCartToolSchema>
type UpdateCartTool = z.infer<typeof updateCartToolSchema>

export type ChatTools = {
    search_shop_catalog: SearchShopCatalogTool;
    search_shop_policies_and_faqs: SearchShopPoliciesFAQsTool;
    get_cart: GetCartTool;
    update_cart: UpdateCartTool;
}

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type ChatMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>