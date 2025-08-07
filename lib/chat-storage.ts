import type { ChatMessage } from "./types";

const DB_NAME = "shopify-chat-assistant";
const DB_VERSION = 1;
const STORE_NAME = "chat-messages";

interface ChatSession {
	id: string;
	messages: ChatMessage[];
	lastUpdated: Date;
	title?: string;
}

class ChatStorage {
	private db: IDBDatabase | null = null;

	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
					store.createIndex("lastUpdated", "lastUpdated", { unique: false });
				}
			};
		});
	}

	async saveMessages(
		sessionId: string,
		messages: ChatMessage[],
	): Promise<void> {
		if (!this.db) await this.init();

		const session: ChatSession = {
			id: sessionId,
			messages,
			lastUpdated: new Date(),
			title: this.generateSessionTitle(messages),
		};

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put(session);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async loadMessages(sessionId: string): Promise<ChatMessage[]> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(sessionId);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const session = request.result as ChatSession | undefined;
				resolve(session?.messages || []);
			};
		});
	}

	async getAllSessions(): Promise<ChatSession[]> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const index = store.index("lastUpdated");
			const request = index.getAll();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const sessions = request.result as ChatSession[];
				sessions.sort(
					(a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime(),
				);
				resolve(sessions);
			};
		});
	}

	async deleteSession(sessionId: string): Promise<void> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.delete(sessionId);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async clearAllSessions(): Promise<void> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.clear();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	private generateSessionTitle(messages: ChatMessage[]): string {
		return `Chat ${new Date().toLocaleDateString()}`;
	}
}

export const chatStorage = new ChatStorage();
export type { ChatSession };
