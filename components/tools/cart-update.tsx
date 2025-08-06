"use client";

import {
	CheckCircleIcon,
	MinusIcon,
	PlusIcon,
	ShoppingCartIcon,
	XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UpdateCartOutput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CartUpdateProps {
	data: UpdateCartOutput;
	className?: string;
}

export function CartUpdate({ data, className }: CartUpdateProps) {
	const updatedItems = data.cart.lines || [];

	return (
		<div data-slot="cart-update" className={cn("space-y-4", className)}>
			<div className="flex items-center gap-2">
				<CheckCircleIcon className="size-4 text-green-600" />
				<h4 className="font-medium text-sm">Cart Updated Successfully</h4>
				{data.cart.total_quantity && (
					<Badge variant="secondary">
						{data.cart.total_quantity} total items
					</Badge>
				)}
			</div>
			{updatedItems.length > 0 && (
				<div className="space-y-2">
					<h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Changes Made
					</h5>

					<div className="grid gap-2">
						{updatedItems.map((item) => {
							const ActionIcon = getActionIcon("added");
							const actionColor = getActionColor("added");

							return (
								<div
									key={item.id}
									className="flex items-center gap-3 rounded-lg border p-2 bg-muted/20"
								>
									<ActionIcon className={cn("size-4", actionColor)} />

									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm truncate">
											{item.merchandise.product.title}
										</p>

										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<span>Added {item.quantity} items</span>
										</div>
									</div>

									<Badge
										variant="outline"
										className={cn("text-xs", actionColor)}
									>
										Added
									</Badge>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{data.cart.checkout_url && (
				<div className="pt-2 border-t">
					<a
						href={data.cart.checkout_url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 py-2 text-sm transition-colors"
					>
						<ShoppingCartIcon className="size-4" />
						View Updated Cart
					</a>
				</div>
			)}
		</div>
	);
}

function getActionIcon(action?: string) {
	switch (action) {
		case "added":
			return PlusIcon;
		case "removed":
			return XIcon;
		default:
			return MinusIcon;
	}
}

function getActionColor(action?: string) {
	switch (action) {
		case "added":
			return "text-green-600";
		case "removed":
			return "text-red-600";
		default:
			return "text-blue-600";
	}
}
