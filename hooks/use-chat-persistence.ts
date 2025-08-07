import { useEffect, useCallback, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { chatStorage } from "@/lib/chat-storage";

const CURRENT_SESSION_KEY = "current-chat-session-id";

export function useChatPersistence() {
	const [sessionId, setSessionId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	// Generate or get current session ID
	useEffect(() => {
		const initSession = () => {
			let currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);
			if (!currentSessionId) {
				currentSessionId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
			}
			setSessionId(currentSessionId);
			setIsLoading(false);
		};

		initSession();
	}, []);

	// Save messages to IndexedDB
	const saveMessages = useCallback(
		async (messages: ChatMessage[]) => {
			if (!sessionId || messages.length === 0) return;

			try {
				await chatStorage.saveMessages(sessionId, messages);
			} catch (error) {
				console.error("Failed to save chat messages:", error);
			}
		},
		[sessionId],
	);

	// Load messages from IndexedDB
	const loadMessages = useCallback(async (): Promise<ChatMessage[]> => {
		if (!sessionId) return [];

		try {
			return await chatStorage.loadMessages(sessionId);
		} catch (error) {
			console.error("Failed to load chat messages:", error);
			return [];
		}
	}, [sessionId]);

	// Start a new chat session
	const startNewSession = useCallback(() => {
		const newSessionId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem(CURRENT_SESSION_KEY, newSessionId);
		setSessionId(newSessionId);
	}, []);

	// Load a specific session
	const loadSession = useCallback((targetSessionId: string) => {
		localStorage.setItem(CURRENT_SESSION_KEY, targetSessionId);
		setSessionId(targetSessionId);
	}, []);

	// Delete current session
	const deleteCurrentSession = useCallback(async () => {
		if (!sessionId) return;

		try {
			await chatStorage.deleteSession(sessionId);
			startNewSession();
		} catch (error) {
			console.error("Failed to delete chat session:", error);
		}
	}, [sessionId, startNewSession]);

	// Get all sessions
	const getAllSessions = useCallback(async () => {
		try {
			return await chatStorage.getAllSessions();
		} catch (error) {
			console.error("Failed to get all sessions:", error);
			return [];
		}
	}, []);

	return {
		sessionId,
		isLoading,
		saveMessages,
		loadMessages,
		startNewSession,
		loadSession,
		deleteCurrentSession,
		getAllSessions,
	};
}
