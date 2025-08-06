"use client";

import { Badge } from "@/components/ui/badge";
import type { SearchShopCatalogOutput } from "@/lib/types";
import { shopifyToolSchemas } from "@/lib/types";
import { cn } from "@/lib/utils";
import { safeValidateToolResult } from "@/lib/validation";

interface ProductCatalogProps {
	data: unknown;
	className?: string;
}

export function ProductCatalog({ data, className }: ProductCatalogProps) {
	const catalogData = safeValidateToolResult(
		shopifyToolSchemas.searchShopCatalogOutput,
		data,
		{ products: [] } as SearchShopCatalogOutput,
	);
	const products = catalogData.products;

	if (products.length === 0) {
		return (
			<div className={cn("text-muted-foreground text-sm", className)}>
				No products found
			</div>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center justify-between">
				<h4 className="font-medium text-sm">Products Found</h4>
				<Badge variant="secondary">{products.length} results</Badge>
			</div>

			<div className="grid gap-3">
				{products.map((product) => (
					<div
						key={product.product_id}
						className="flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
					>
						{product.variants?.[0]?.image_url && (
							<img
								src={product.variants[0].image_url}
								alt={product.title}
								className="size-16 rounded-md object-cover flex-shrink-0"
							/>
						)}

						<div className="flex-1 min-w-0">
							<h5 className="font-medium text-sm truncate">{product.title}</h5>

							<div className="flex items-center gap-2 mt-1">
								<span className="font-semibold text-sm">
									{product.variants?.[0]?.currency || "$"}
									{product.variants?.[0]?.price}
								</span>
								{product.variants?.[0]?.variant_id && (
									<Badge variant="outline" className="text-xs">
										Variant: {product.variants?.[0]?.variant_id}
									</Badge>
								)}
							</div>

							{product.description && (
								<p className="text-muted-foreground text-xs mt-1 line-clamp-2">
									{product.description}
								</p>
							)}

							{product.url && (
								<a
									href={product.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline text-xs mt-1 inline-block"
								>
									View Product →
								</a>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
