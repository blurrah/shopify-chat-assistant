"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { SearchShopCatalogOutput } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCarousel({ data, className, sendMessage }: {
	data: SearchShopCatalogOutput;
	className?: string;
	sendMessage: (message: { text: string }) => void;
}) {
	const products = data.products;

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
				className="w-full mr-4"
			>
				<CarouselContent className="">
					{products.map((product) => (
						<CarouselItem key={product.product_id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
							<div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors h-full flex flex-col">
								{product.variants[0].image_url && (
									<img
										src={product.variants[0].image_url}
										alt={product.title}
										className="w-full h-48 rounded-md object-cover mb-3"
									/>
								)}

								<div className="space-y-2 flex-1 flex flex-col">
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

									<div className="flex flex-col gap-2 mt-auto">
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
										<Button
											size="sm"
											className="w-full"
											onClick={() => {
												const message = `Add "${product.title}" to my cart (variant: ${product.variants[0].variant_id})`;
												sendMessage({ text: message });
											}}
										>
											Add to Cart
										</Button>
									</div>
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