"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
import { ArrowRight } from "lucide-react";
import { type FormEventHandler, useState } from "react";
import {
	AIInput,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import type { ChatMessage } from "@/lib/types";

export function MessageInput({
	sendMessage,
	status,
}: {
	status: UseChatHelpers<ChatMessage>["status"];
	sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}) {
	const [text, setText] = useState<string>("");

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		if (!text.trim()) {
			return;
		}
		sendMessage({
			text: text.trim(),
			metadata: {
				createdAt: new Date().toISOString(),
			},
		});
		setText("");
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (text.trim()) {
				sendMessage({
					text: text.trim(),
					metadata: {
						createdAt: new Date().toISOString(),
					},
				});
				setText("");
			}
		}
	};

	return (
		<AIInput
			onSubmit={handleSubmit}
			className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-border focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"
		>
			<AIInputTextarea
				onChange={(e) => setText(e.target.value)}
				onKeyDown={handleKeyDown}
				value={text}
				placeholder="Ask about products, policies, or your cart..."
				className="border-0 bg-transparent placeholder:text-muted-foreground focus:ring-0 resize-none px-4 py-3 !text-[17px]"
			/>
			<AIInputToolbar className="border-0 bg-transparent px-2 pb-2">
				<AIInputTools />
				<AIInputSubmit
					disabled={!text.trim()}
					status={status}
					className="bg-primary hover:bg-primary/90 disabled:bg-muted-foreground/20 disabled:cursor-not-allowed text-primary-foreground disabled:text-muted-foreground rounded-lg p-2 transition-all hover:scale-105"
				>
					<ArrowRight className="w-4 h-4" />
				</AIInputSubmit>
			</AIInputToolbar>
		</AIInput>
	);
}
