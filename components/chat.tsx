"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from "@/components/ui/kibo-ui/ai/conversation";
import {
	AIMessage,
	AIMessageContent,
} from "@/components/ui/kibo-ui/ai/message";
import { MessageInput } from "./message-input";
import { OpeningScreen } from "./opening-screen";

export function Chat() {
	const { messages, sendMessage, status } = useChat();
	const [showOpeningScreen, setShowOpeningScreen] = useState(true);

	const handleOpeningSubmit = (message: string) => {
		setShowOpeningScreen(false);
		sendMessage({ content: message });
	};

	if (showOpeningScreen) {
		return <OpeningScreen onSubmit={handleOpeningSubmit} />;
	}

	return (
		<div>
			<AIConversation className="relative size-full ">
				<AIConversationContent>
					{messages.map((message) => (
						<AIMessage
							from={message.role === "system" ? "assistant" : message.role}
							key={message.id}
						>
							<AIMessageContent>
								{message.parts.map((part) => {
									if (part.type === "text") {
										return part.text;
									}
                                    return null;
								})}
							</AIMessageContent>
						</AIMessage>
					))}
				</AIConversationContent>
				<AIConversationScrollButton />
			</AIConversation>
			<footer>
				<MessageInput sendMessage={sendMessage} status={status} />
			</footer>
		</div>
	);
}
