"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface OpeningScreenProps {
	onSubmit: (message: string) => void;
}

export function OpeningScreen({ onSubmit }: OpeningScreenProps) {
	const [input, setInput] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			onSubmit(input.trim());
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6">
			<div className="w-full max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-center mb-12 sm:mb-20">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
						Shopify AI Assistant
					</h1>
				</div>

				{/* Main Content */}
				<div className="text-center mb-8 sm:mb-12">
					<p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
						How can I help you shop today?
					</p>

					<form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
						<div className="relative">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="What are you looking for today?"
								className="w-full px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16 sm:pr-20 shadow-lg hover:shadow-xl transition-shadow"
								autoFocus
							/>
							<button
								type="submit"
								disabled={!input.trim()}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all hover:scale-105"
							>
								<ArrowRight className="w-6 h-6" />
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
