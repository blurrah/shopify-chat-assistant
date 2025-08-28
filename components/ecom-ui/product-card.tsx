"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
	product: Product;
	sendMessage: (message: { text: string }) => void;
	className?: string;
}

export function ProductCard({
	product,
	sendMessage,
	className,
}: ProductCardProps) {
	return (
		<div
			className={`rounded-lg border p-4 hover:bg-muted/50 transition-colors h-full flex flex-col ${className || ""}`}
		>
			{product.image_url && (
				<img
					src={product.image_url}
					alt={product.title}
					className="w-full h-48 rounded-md object-cover mb-3"
				/>
			)}

			<div className="flex flex-1 flex-col space-y-2">
				<h5 className="font-medium text-sm line-clamp-2">{product.title}</h5>

				<div className="flex items-center justify-between">
					<span className="font-semibold text-base">
						Between {formatPrice(Number(product.price_range?.min))} and{" "}
						{formatPrice(Number(product.price_range?.max))}
					</span>
				</div>

				{product.description && (
					<p className="line-clamp-3 text-muted-foreground text-xs">
						{product.description}
					</p>
				)}

				<div className="mt-auto flex flex-col gap-2">
					{product.url && (
						<a
							href={product.url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block font-medium text-primary text-sm hover:underline"
						>
							View Product →
						</a>
					)}
					<Button
						size="sm"
						className="w-full"
						onClick={() => {
							const message = `Add "${product.title}" to my cart (variant: default)`;
							sendMessage({ text: message });
						}}
					>
						Add to Cart
					</Button>
					<Button
						size="sm"
						className="w-full"
						variant="outline"
						onClick={() => {
							const message = `Get the product details for ${product.product_id}`;
							sendMessage({ text: message });
						}}
					>
						Get product details
					</Button>
				</div>
			</div>
		</div>
	);
}
