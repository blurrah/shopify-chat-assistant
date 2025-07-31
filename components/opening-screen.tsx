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
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-6">
			<div className="w-full max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-center mb-20">
					<h1 className="text-4xl font-bold text-gray-900 mr-3">
						Shop AI
					</h1>
					<div className="flex gap-1.5">
						<div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
						<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-75"></div>
						<div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
						<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-300"></div>
					</div>
				</div>

				{/* Main Content */}
				<div className="text-center mb-12">
					<p className="text-xl text-gray-600 mb-8">Tell us what you're looking for</p>
					
					<form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
						<div className="relative">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="What are you looking for today?"
								className="w-full px-8 py-5 text-xl rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 shadow-lg hover:shadow-xl transition-shadow"
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

				{/* Product Images Placeholder */}
				<div className="flex justify-center items-end space-x-6 mt-20">
					{Array.from({ length: 7 }).map((_, i) => (
						<div
							key={i}
							className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
							style={{
								width: i === 3 ? '140px' : i === 2 || i === 4 ? '110px' : '85px',
								height: i === 3 ? '180px' : i === 2 || i === 4 ? '140px' : '110px',
							}}
						>
							<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
								<Sparkles className="w-8 h-8 text-gray-400" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}