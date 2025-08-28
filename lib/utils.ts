import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatPrice(price?: number) {
	if (!price) return "N/A";
	return price.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});
}
