"use client";

import { Badge } from "@/components/ui/badge";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { SearchShopCatalogOutput } from "@/lib/types";
import { shopifyToolSchemas } from "@/lib/types";
import { cn } from "@/lib/utils";
import { safeValidateToolResult } from "@/lib/validation";

interface ProductCarouselProps {
	data: unknown;
	className?: string;
}

export function ProductCarousel({ data, className }: ProductCarouselProps) {
	const catalogData = safeValidateToolResult(
		shopifyToolSchemas.searchShopCatalogOutput,
		data,
		{ products: [] } as SearchShopCatalogOutput,
	);
	const products = catalogData.products;

	if (products.length === 0) {
		return null;
	}

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-medium text-lg">Products</h3>
				<Badge variant="secondary">{products.length} found</Badge>
			</div>
			
			<Carousel
				opts={{
					align: "start",
				}}
				className="w-full"
			>
				<CarouselContent>
					{products.map((product) => (
						<CarouselItem key={product.product_id} className="md:basis-1/2 lg:basis-1/3">
							<div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors h-full">
								{product.variants[0].image_url && (
									<img
										src={product.variants[0].image_url}
										alt={product.title}
										className="w-full h-48 rounded-md object-cover mb-3"
									/>
								)}

								<div className="space-y-2">
									<h5 className="font-medium text-sm line-clamp-2">{product.title}</h5>

									<div className="flex items-center justify-between">
										<span className="font-semibold text-base">
											{product.variants[0].currency || "$"}
											{product.variants[0].price}
										</span>
									</div>

									{product.description && (
										<p className="text-muted-foreground text-xs line-clamp-3">
											{product.description}
										</p>
									)}

									{product.url && (
										<a
											href={product.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline text-sm font-medium inline-block"
										>
											View Product →
										</a>
									)}
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}