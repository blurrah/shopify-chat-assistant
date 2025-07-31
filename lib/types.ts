import { UIDataTypes, UIMessage } from "ai";
import { z } from "zod";

export const messageMetadataSchema = z.object({
    createdAt: z.string(),
})

type SearchShopCatalogTool = {
    input: { query: string };
    output: {
        products: {
            id: string;
            title: string;
            price: number;
            currency?: string;
            variantId?: string;
            url?: string;
            imageUrl?: string;
            description?: string;
        }[]
    }
}

type SearchShopPoliciesFAQsTool = {
    input: { query: string };
    output: {
        answer: string;
        type?: 'policy' | 'faq';
        title?: string;
        category?: string;
    }
}

type GetCartTool = {
    input: { cartId?: string };
    output: {
        id: string;
        items: {
            id: string;
            title: string;
            quantity: number;
            price: number;
            currency?: string;
            variantId?: string;
            imageUrl?: string;
        }[];
        totalQuantity?: number;
        totalPrice?: number;
        currency?: string;
        checkoutUrl?: string;
    }
}

type UpdateCartTool = {
    input: {
        cartId?: string;
        items: {
            variantId: string;
            quantity: number;
        }[];
    };
    output: {
        success: boolean;
        message?: string;
        cartId?: string;
        updatedItems?: {
            id: string;
            title: string;
            quantity: number;
            action?: 'added' | 'updated' | 'removed';
            previousQuantity?: number;
        }[];
        totalItems?: number;
        checkoutUrl?: string;
    }
}

export type ChatTools = {
    search_shop_catalog: SearchShopCatalogTool;
    search_shop_policies_and_faqs: SearchShopPoliciesFAQsTool;
    get_cart: GetCartTool;
    update_cart: UpdateCartTool;
}

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type ChatMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>