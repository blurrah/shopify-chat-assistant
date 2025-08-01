"use client";

import { ExternalLinkIcon, ShoppingCartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GetCartOutput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CartProps {
	data: GetCartOutput;
	className?: string;
}

export function Cart({ data, className }: CartProps) {
	const items = data.cart.lines;
	const isEmpty = items.length === 0;

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center justify-between w-[612px]">
				<div className="flex items-center gap-2">
					<ShoppingCartIcon className="size-4 text-muted-foreground" />
					<h4 className="font-medium text-sm">Shopping Cart</h4>
				</div>
				{!isEmpty && (
					<Badge variant="secondary">
						{data.cart.total_quantity || items.length} items
					</Badge>
				)}
			</div>

			{isEmpty ? (
				<div className="text-center py-6 text-muted-foreground">
					<ShoppingCartIcon className="size-8 mx-auto mb-2 opacity-50" />
					<p className="text-sm">Your cart is empty</p>
				</div>
			) : (
				<div className="space-y-3">
					<div className="grid gap-2">
						{items.map((item) => (
							<div
								key={item.id}
								className="flex gap-3 rounded-lg border p-3 bg-muted/20"
							>
								<div className="flex-1 min-w-0">
									<h5 className="font-medium text-sm truncate">
										{item.merchandise.product.title}
									</h5>

									<div className="flex items-center justify-between mt-1">
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>Qty: {item.quantity}</span>
											<span>• Variant: {item.merchandise.id}</span>
										</div>

										<span className="font-semibold text-sm">
											{item.cost.total_amount.currency || "$"}
											{item.cost.total_amount.amount}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>

					{data.cart.cost.total_amount.amount && (
						<div className="flex items-center justify-between pt-2 border-t">
							<span className="font-medium text-sm">Total</span>
							<span className="font-bold text-lg">
								{data.cart.cost.total_amount.currency || "$"}
								{data.cart.cost.total_amount.amount}
							</span>
						</div>
					)}

					{data.cart.checkout_url && (
						<a
							href={data.cart.checkout_url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
						>
							Proceed to Checkout
							<ExternalLinkIcon className="size-4" />
						</a>
					)}
				</div>
			)}
		</div>
	);
}
