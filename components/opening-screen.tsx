"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

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
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-4">
			<div className="w-full max-w-2xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-center mb-16">
					<h1 className="text-2xl font-semibold text-gray-900 mr-2">
						Shop AI
					</h1>
					<div className="flex gap-1">
						<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
						<div className="w-2 h-2 bg-green-500 rounded-full"></div>
						<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
						<div className="w-2 h-2 bg-red-500 rounded-full"></div>
					</div>
				</div>

				{/* Main Content */}
				<div className="text-center mb-8">
					<p className="text-gray-600 mb-6">Tell us what you're looking for</p>
					
					<form onSubmit={handleSubmit} className="relative">
						<div className="relative">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="What are you looking for today?"
								className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
								autoFocus
							/>
							<button
								type="submit"
								disabled={!input.trim()}
								className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors"
							>
								<ArrowRight className="w-5 h-5" />
							</button>
						</div>
					</form>
				</div>

				{/* Product Images Placeholder */}
				<div className="flex justify-center items-end space-x-4 mt-16">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="bg-gray-200 rounded-lg overflow-hidden shadow-sm"
							style={{
								width: i === 2 ? '120px' : '80px',
								height: i === 2 ? '160px' : '120px',
							}}
						>
							<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-gray-500" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}