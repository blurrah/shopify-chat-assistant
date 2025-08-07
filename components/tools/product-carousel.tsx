"use client";

import { Badge } from "@/components/ui/badge";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ecom-ui/product-card";
import type { SearchShopCatalogOutput } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCarousel({
	data,
	className,
	sendMessage,
}: {
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
						<CarouselItem key={product.product_id} className="md:basis-1/2">
							<ProductCard product={product} sendMessage={sendMessage} />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
