"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
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

	return (
		<AIInput onSubmit={handleSubmit} className="border-0 bg-gray-50 rounded-xl">
			<AIInputTextarea
				onChange={(e) => setText(e.target.value)}
				value={text}
				placeholder="Ask about products, policies, or your cart..."
				className="border-0 bg-transparent placeholder:text-gray-500 focus:ring-0 resize-none"
			/>
			<AIInputToolbar className="border-0 bg-transparent">
				<AIInputTools />
				<AIInputSubmit
					disabled={!text.trim()}
					status={status}
					className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
				/>
			</AIInputToolbar>
		</AIInput>
	);
}
