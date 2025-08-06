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
import type { GetProductDetailsOutput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductDetailsProps {
	data: GetProductDetailsOutput;
	sendMessage: (message: { text: string }) => void;
	className?: string;
}

export function ProductDetails({ data, sendMessage, className }: ProductDetailsProps) {
	const { product } = data;
	console.log("product", product);
	const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

	const handleOptionChange = (optionName: string, value: string) => {
		setSelectedOptions(prev => ({
			...prev,
			[optionName]: value
		}));
	};

	const getSelectedVariantText = () => {
		const optionText = Object.entries(selectedOptions)
			.map(([key, value]) => `${key}: ${value}`)
			.join(", ");
		return optionText || product.selectedOrFirstAvailableVariant.title;
	};

	return (
		<div className={cn("space-y-6 max-w-4xl mx-auto", className)}>
			{/* Product Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">
					<a 
						href={product.url} 
						target="_blank" 
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						{product.title}
					</a>
				</h2>
				<div className="flex items-center gap-4">
					<div className="text-2xl font-bold">
						{product.price_range.currency}{product.selectedOrFirstAvailableVariant.price}
					</div>
					{product.price_range.min !== product.price_range.max && (
						<div className="text-muted-foreground">
							Range: {product.price_range.currency}{product.price_range.min} - {product.price_range.currency}{product.price_range.max}
						</div>
					)}
					<Badge variant={product.selectedOrFirstAvailableVariant.available ? "default" : "secondary"}>
						{product.selectedOrFirstAvailableVariant.available ? "In Stock" : "Out of Stock"}
					</Badge>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Product Images */}
				<div className="space-y-4">
					{product.images.length > 1 ? (
						<Carousel className="w-full">
							<CarouselContent>
								{product.images.map((image, index) => (
									<CarouselItem key={index}>
										<img
											src={image.url}
											alt={image.alt_text || `${product.title} - Image ${index + 1}`}
											className="w-full h-96 rounded-lg object-cover"
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					) : (
						<img
							src={product.image_url}
							alt={product.title}
							className="w-full h-96 rounded-lg object-cover"
						/>
					)}
					
					{product.images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto">
							{product.images.map((image, index) => (
								<img
									key={index}
									src={image.url}
									alt={image.alt_text || `${product.title} - Thumbnail ${index + 1}`}
									className="w-16 h-16 rounded-md object-cover border cursor-pointer hover:border-primary"
								/>
							))}
						</div>
					)}
				</div>

				{/* Product Details */}
				<div className="space-y-6">
					{/* Description */}
					<div>
						<h3 className="font-semibold mb-2">Description</h3>
						<p className="text-muted-foreground leading-relaxed">{product.description}</p>
					</div>

					{/* Options */}
					{product.options.length > 0 && (
						<div className="space-y-4">
							<h3 className="font-semibold">Options</h3>
							{product.options.map((option) => (
								<div key={option.name} className="space-y-2">
									<label className="text-sm font-medium">{option.name}</label>
									<div className="flex flex-wrap gap-2">
										{option.values.map((value) => (
											<button
												key={value}
												onClick={() => handleOptionChange(option.name, value)}
												className={`px-3 py-1 rounded-md border text-sm transition-colors ${
													selectedOptions[option.name] === value
														? "bg-primary text-primary-foreground border-primary"
														: "hover:bg-muted border-input"
												}`}
											>
												{value}
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					)}

					{/* Selected Variant Info */}
					<div className="bg-muted/50 p-4 rounded-lg">
						<h4 className="font-medium mb-2">Selected Variant</h4>
						<p className="text-sm text-muted-foreground">{getSelectedVariantText()}</p>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button
							size="lg"
							className="w-full"
							disabled={!product.selectedOrFirstAvailableVariant.available}
							onClick={() => {
								const variantText = getSelectedVariantText();
								const message = `Add "${product.title}" to my cart (variant: ${variantText})`;
								sendMessage({ text: message });
							}}
						>
							{product.selectedOrFirstAvailableVariant.available ? "Add to Cart" : "Out of Stock"}
						</Button>
						
						<Button
							size="lg"
							variant="outline"
							className="w-full"
							onClick={() => {
								const message = `Show me similar products to "${product.title}"`;
								sendMessage({ text: message });
							}}
						>
							Find Similar Products
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}