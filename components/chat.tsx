"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
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
import { SessionList } from "./session-list";
import { useChatPersistence } from "@/hooks/use-chat-persistence";

export function Chat({ isDebug = false }: { isDebug?: boolean }) {
	const { messages, sendMessage, status, setMessages } = useChat<ChatMessage>();
	const [showOpeningScreen, setShowOpeningScreen] = useState(true);
	const {
		sessionId,
		isLoading: isPersistenceLoading,
		saveMessages,
		loadMessages,
		startNewSession,
		loadSession,
	} = useChatPersistence();

	// Load persisted messages when session changes
	useEffect(() => {
		const loadPersistedMessages = async () => {
			if (isPersistenceLoading || !sessionId) return;

			try {
				const persistedMessages = await loadMessages();
				setMessages(persistedMessages);
				setShowOpeningScreen(persistedMessages.length === 0);
			} catch (error) {
				console.error("Failed to load persisted messages:", error);
			}
		};

		loadPersistedMessages();
	}, [sessionId, isPersistenceLoading, loadMessages, setMessages]);

	// Save messages whenever they change
	useEffect(() => {
		if (messages.length > 0 && !isPersistenceLoading) {
			saveMessages(messages);
		}
	}, [messages, saveMessages, isPersistenceLoading]);

	const handleOpeningSubmit = (message: string) => {
		setShowOpeningScreen(false);
		sendMessage({ text: message });
	};

	const handleNewSession = () => {
		startNewSession();
		setMessages([]);
		setShowOpeningScreen(true);
	};

	const handleSessionSelect = (targetSessionId: string) => {
		if (targetSessionId === sessionId) return;
		loadSession(targetSessionId);
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
							Shopify AI Assistant {isDebug ? "DEBUG" : ""}
						</h1>
					</div>
					<div className="flex items-center gap-4">
						<SessionList
							currentSessionId={sessionId}
							onSessionSelect={handleSessionSelect}
							onNewSession={handleNewSession}
						/>
						<div className="text-sm text-gray-500 hidden sm:block">
							{messages.length} messages
						</div>
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
							className="[&:has([data-slot='carousel'])>div]:max-w-[calc(100%-2rem)] [&:has([data-slot='product-details'])>div]:max-w-[calc(100%-2rem)] [&:has([data-slot='cart-update'])>div]:w-[calc(80%-2rem)]"
						>
							<AIMessageContent>
								<MessagePartsHandler
									parts={message.parts}
									sendMessage={sendMessage}
									isDebug={isDebug}
								/>
							</AIMessageContent>
						</AIMessage>
					))}
				</AIConversationContent>
				<AIConversationScrollButton />
			</AIConversation>

			{/* Footer */}
			<footer className="px-4 sm:px-6 pb-6">
				<div className="max-w-4xl mx-auto">
					<MessageInput sendMessage={sendMessage} status={status} />
				</div>
			</footer>
		</div>
	);
}
