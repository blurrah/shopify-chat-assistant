"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Plus } from "lucide-react";
import type { ChatSession } from "@/lib/chat-storage";
import { useChatPersistence } from "@/hooks/use-chat-persistence";
import { Button } from "@/components/ui/button";

interface SessionListProps {
	currentSessionId: string;
	onSessionSelect: (sessionId: string) => void;
	onNewSession: () => void;
}

export function SessionList({
	currentSessionId,
	onSessionSelect,
	onNewSession,
}: SessionListProps) {
	const [sessions, setSessions] = useState<ChatSession[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const { getAllSessions, deleteCurrentSession } = useChatPersistence();

	// Load sessions on mount and when currentSessionId changes
	useEffect(() => {
		const loadSessions = async () => {
			const allSessions = await getAllSessions();
			setSessions(allSessions);
		};

		loadSessions();
	}, [getAllSessions, currentSessionId]);

	// Also load when dropdown opens to ensure fresh data
	useEffect(() => {
		const loadSessions = async () => {
			const allSessions = await getAllSessions();
			setSessions(allSessions);
		};

		if (isOpen) {
			loadSessions();
		}
	}, [isOpen, getAllSessions]);

	const handleDeleteSession = async (
		sessionId: string,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();

		if (sessionId === currentSessionId) {
			await deleteCurrentSession();
		} else {
			// For non-current sessions, we need to delete directly from storage
			const { chatStorage } = await import("@/lib/chat-storage");
			await chatStorage.deleteSession(sessionId);
		}

		// Refresh sessions list
		const allSessions = await getAllSessions();
		setSessions(allSessions);
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffInHours < 24 * 7) {
			return date.toLocaleDateString([], { weekday: "short" });
		} else {
			return date.toLocaleDateString([], { month: "short", day: "numeric" });
		}
	};

	return (
		<div className="relative">
			<Button
				variant="outline"
				size="sm"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2"
			>
				<MessageSquare className="w-4 h-4" />
				Chats ({sessions.length})
			</Button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
						<div className="p-3 border-b border-gray-100">
							<Button
								onClick={() => {
									onNewSession();
									setIsOpen(false);
								}}
								className="w-full flex items-center gap-2"
								size="sm"
							>
								<Plus className="w-4 h-4" />
								New Chat
							</Button>
						</div>

						<div className="p-2">
							{sessions.length === 0 ? (
								<div className="text-center text-gray-500 py-4">
									No saved chats yet
								</div>
							) : (
								sessions.map((session) => (
									<div
										key={session.id}
										className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer group ${
											session.id === currentSessionId
												? "bg-blue-50 border border-blue-200"
												: ""
										}`}
										onClick={() => {
											onSessionSelect(session.id);
											setIsOpen(false);
										}}
									>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium text-gray-900 truncate">
												{session.title}
											</div>
											<div className="text-xs text-gray-500">
												{formatDate(new Date(session.lastUpdated))} •{" "}
												{session.messages.length} messages
											</div>
										</div>
										<button
											onClick={(e) => handleDeleteSession(session.id, e)}
											className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								))
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
