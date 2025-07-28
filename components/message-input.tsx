"use client";
import type { UseChatHelpers } from "@ai-sdk/react";
import { GlobeIcon, MicIcon, PlusIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";
import {
	AIInput,
	AIInputButton,
	AIInputModelSelect,
	AIInputModelSelectContent,
	AIInputModelSelectItem,
	AIInputModelSelectTrigger,
	AIInputModelSelectValue,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import type { ChatMessage } from "@/lib/types";

const models = [
	{ id: "gpt-4", name: "GPT-4" },
	{ id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
	{ id: "claude-2", name: "Claude 2" },
	{ id: "claude-instant", name: "Claude Instant" },
	{ id: "palm-2", name: "PaLM 2" },
	{ id: "llama-2-70b", name: "Llama 2 70B" },
	{ id: "llama-2-13b", name: "Llama 2 13B" },
	{ id: "cohere-command", name: "Command" },
	{ id: "mistral-7b", name: "Mistral 7B" },
];
export function MessageInput({
	sendMessage,
	status,
}: {
    status: UseChatHelpers<ChatMessage>["status"]
	sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}) {
	const [text, setText] = useState<string>("");
	const [model, setModel] = useState<string>(models[0].id);
	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		if (!text) {
			return;
		}
		sendMessage({
			text,
			metadata: {
				createdAt: new Date().toISOString(),
			},
		});
	};
	return (
		<AIInput onSubmit={handleSubmit}>
			<AIInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
			<AIInputToolbar>
				<AIInputTools>
					<AIInputButton>
						<PlusIcon size={16} />
					</AIInputButton>
					<AIInputButton>
						<MicIcon size={16} />
					</AIInputButton>
					<AIInputButton>
						<GlobeIcon size={16} />
						<span>Search</span>
					</AIInputButton>
					<AIInputModelSelect onValueChange={setModel} value={model}>
						<AIInputModelSelectTrigger>
							<AIInputModelSelectValue />
						</AIInputModelSelectTrigger>
						<AIInputModelSelectContent>
							{models.map((model) => (
								<AIInputModelSelectItem key={model.id} value={model.id}>
									{model.name}
								</AIInputModelSelectItem>
							))}
						</AIInputModelSelectContent>
					</AIInputModelSelect>
				</AIInputTools>
				<AIInputSubmit disabled={!text} status={status} />
			</AIInputToolbar>
		</AIInput>
	);
}
