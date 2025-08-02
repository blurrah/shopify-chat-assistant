import { z } from "zod";
import { shopifyToolSchemas } from "./types";

// Validation result type
export type ValidationResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
			data?: undefined;
	  };

// Generic validation function
export function validateToolResult<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): ValidationResult<T> {
	try {
		const result = schema.parse(data);
		return { success: true, data: result };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessage = error.issues
				.map((e) => `${e.path.join(".")}: ${e.message}`)
				.join(", ");
			return { success: false, error: `Validation failed: ${errorMessage}` };
		}
		return { success: false, error: "Unknown validation error" };
	}
}

// Specific validation functions for each tool
export function validateProductCatalogResult(data: unknown) {
	return validateToolResult(shopifyToolSchemas.searchShopCatalogOutput, data);
}

export function validatePolicyFAQResult(data: unknown) {
	return validateToolResult(
		shopifyToolSchemas.searchShopPoliciesFAQsOutput,
		data,
	);
}

export function validateCartResult(data: unknown) {
	return validateToolResult(shopifyToolSchemas.getCartOutput, data);
}

export function validateCartUpdateResult(data: unknown) {
	return validateToolResult(shopifyToolSchemas.updateCartOutput, data);
}

// Helper function to safely validate and return data with fallbacks
export function safeValidateToolResult<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
	fallback: T,
): T {
	const result = validateToolResult(schema, data);
	if (result.success) {
		return result.data;
	}
	console.warn("Tool result validation failed:", result.error);
	return fallback;
}
