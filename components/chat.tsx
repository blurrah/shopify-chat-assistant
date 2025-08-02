"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from "@/components/ui/kibo-ui/ai/conversation";
import {
	AIMessage,
	AIMessageContent,
} from "@/components/ui/kibo-ui/ai/message";
import type { ChatMessage } from "@/lib/types";
import { MessageInput } from "./message-input";
import { MessagePartsHandler } from "./message-parts-handler";
import { OpeningScreen } from "./opening-screen";

export function Chat() {
	const { messages, sendMessage, status } = useChat<ChatMessage>();
	const [showOpeningScreen, setShowOpeningScreen] = useState(true);

	const handleOpeningSubmit = (message: string) => {
		setShowOpeningScreen(false);
		sendMessage({ text: message });
	};

	if (showOpeningScreen) {
		return <OpeningScreen onSubmit={handleOpeningSubmit} />;
	}

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h1 className="text-lg sm:text-xl font-semibold text-gray-900">
							Shopify AI Assistant
						</h1>
						<div className="flex gap-1">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
						</div>
					</div>
					<div className="text-sm text-gray-500 hidden sm:block">
						{messages.length} messages
					</div>
				</div>
			</header>

			{/* Chat Content */}
			<AIConversation className="flex-1 relative">
				<AIConversationContent className="max-w-4xl mx-auto px-4 sm:px-6">
					{messages.map((message) => (
						<AIMessage
							from={message.role === "system" ? "assistant" : message.role}
							key={message.id}
						>
							<AIMessageContent>
								<MessagePartsHandler parts={message.parts} sendMessage={sendMessage} />
							</AIMessageContent>
						</AIMessage>
					))}
				</AIConversationContent>
				<AIConversationScrollButton />
			</AIConversation>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
				<div className="max-w-4xl mx-auto">
					<MessageInput sendMessage={sendMessage} status={status} />
				</div>
			</footer>
		</div>
	);
}
