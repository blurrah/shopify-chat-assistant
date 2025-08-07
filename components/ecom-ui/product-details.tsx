"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GetProductDetailsOutput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductDetailsProps {
	data: GetProductDetailsOutput;
	sendMessage: (message: { text: string }) => void;
	className?: string;
}

export function ProductDetails({
	data,
	sendMessage,
	className,
}: ProductDetailsProps) {
	const { product } = data;
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string>
	>({});
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const handleOptionChange = (optionName: string, value: string) => {
		setSelectedOptions((prev) => ({
			...prev,
			[optionName]: value,
		}));
	};

	const getSelectedVariantText = () => {
		const optionText = Object.entries(selectedOptions)
			.map(([key, value]) => `${key}: ${value}`)
			.join(", ");
		return optionText || product.selectedOrFirstAvailableVariant.title;
	};

	const formatPrice = (price: string, currency: string) => {
		const numericPrice = parseFloat(price);
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		}).format(numericPrice);
	};

	return (
		<div
			className={cn("space-y-6 w-full max-w-4xl mx-auto px-4", className)}
			data-slot="product-details"
		>
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
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
					<div className="text-2xl font-bold">
						{formatPrice(
							product.selectedOrFirstAvailableVariant.price,
							product.selectedOrFirstAvailableVariant.currency,
						)}
					</div>
					{product.price_range.min !== product.price_range.max && (
						<div className="text-muted-foreground text-sm">
							Range:{" "}
							{formatPrice(
								product.price_range.min,
								product.price_range.currency,
							)}{" "}
							-{" "}
							{formatPrice(
								product.price_range.max,
								product.price_range.currency,
							)}
						</div>
					)}
					<Badge
						variant={
							product.selectedOrFirstAvailableVariant.available
								? "default"
								: "secondary"
						}
					>
						{product.selectedOrFirstAvailableVariant.available
							? "In Stock"
							: "Out of Stock"}
					</Badge>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
				{/* Product Images */}
				<div className="space-y-4 min-w-0">
					{/* Main Image */}
					<div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
						<img
							src={
								product.images.length > 0
									? product.images[selectedImageIndex].url
									: product.image_url
							}
							alt={
								product.images.length > 0
									? product.images[selectedImageIndex].alt_text ||
										`${product.title} - Image ${selectedImageIndex + 1}`
									: product.title
							}
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Thumbnail Navigation */}
					{product.images.length > 1 && (
						<div className="min-w-0">
							<div className="flex gap-2 overflow-x-auto pb-2">
								{product.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImageIndex(index)}
										className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden border-2 transition-all ${
											selectedImageIndex === index
												? "border-primary shadow-md"
												: "border-gray-200 hover:border-gray-400"
										}`}
									>
										<img
											src={image.url}
											alt={
												image.alt_text ||
												`${product.title} - Thumbnail ${index + 1}`
											}
											className="w-full h-full object-cover"
											draggable="false"
										/>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Product Details */}
				<div className="space-y-6">
					{/* Description */}
					<div>
						<h3 className="font-semibold mb-2">Description</h3>
						<p className="text-muted-foreground leading-relaxed">
							{product.description}
						</p>
					</div>

					{/* Options */}
					{product.options.length > 0 && (
						<div className="flex flex-col gap-5">
							{product.options.map((option) => (
								<div key={option.name} className="flex flex-col gap-3">
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
							{product.selectedOrFirstAvailableVariant.available
								? "Add to Cart"
								: "Out of Stock"}
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
