"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HelpCircleIcon, FileTextIcon } from "lucide-react";
import type { SearchShopPoliciesFAQsOutput } from "@/lib/types";
import { safeValidateToolResult } from "@/lib/validation";
import { shopifyToolSchemas } from "@/lib/types";

interface PolicyFAQProps {
	data: unknown;
	className?: string;
}

export function PolicyFAQ({ data, className }: PolicyFAQProps) {
	const policyData = safeValidateToolResult(
		shopifyToolSchemas.searchShopPoliciesFAQsOutput,
		data,
		{ answer: "" } as SearchShopPoliciesFAQsOutput,
	);

	if (!policyData?.answer) {
		return (
			<div className={cn("text-muted-foreground text-sm", className)}>
				No policy or FAQ information found
			</div>
		);
	}

	const isPolicy = policyData.type === "policy";
	const Icon = isPolicy ? FileTextIcon : HelpCircleIcon;

	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex items-center gap-2">
				<Icon className="size-4 text-muted-foreground" />
				<h4 className="font-medium text-sm">
					{policyData.title || (isPolicy ? "Store Policy" : "FAQ Answer")}
				</h4>
				{policyData.category && (
					<Badge variant="secondary" className="text-xs">
						{policyData.category}
					</Badge>
				)}
			</div>

			<div className="rounded-lg border p-3 bg-muted/30">
				<div className="prose prose-sm max-w-none">
					<p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
						{policyData.answer}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-1 text-muted-foreground text-xs">
				<Badge variant="outline" className="text-xs">
					{isPolicy ? "Policy" : "FAQ"}
				</Badge>
				<span>• Information from store knowledge base</span>
			</div>
		</div>
	);
}
