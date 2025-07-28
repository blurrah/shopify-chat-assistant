import { UIDataTypes, UIMessage } from "ai";
import { z } from "zod";

export const messageMetadataSchema = z.object({
    createdAt: z.string(),
})

type ProductsCatalogTool = {
    input: unknown;
    output: {
        // TODO: temp
        products: {
            id: string;
            title: string;
            price: number;
            image: string;
            url: string;
        }[]
    }
}

type ChatTools = {
    productsCatalog: ProductsCatalogTool
}

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

export type ChatMessage = UIMessage<MessageMetadata, UIDataTypes, ChatTools>