import ReactMarkdown from "react-markdown";
import hardenReactMarkdown from "harden-react-markdown";
import { allowedOrigins } from "@/lib/ai";

// Uses harden-react-markdown to prevent prompt injection and other attack vectors
const HardenedMarkdown = hardenReactMarkdown(ReactMarkdown);

export function Markdown({ children }: { children: string }) {
	return (
		<HardenedMarkdown
			defaultOrigin="https://shopify-chat-assistant.vercel.app"
			allowedLinkPrefixes={allowedOrigins}
			components={{
				a: ({ href, children }) => {
					if (!href) return children;
					return (
						<a
							href={href}
							target="_blank"
							className="underline"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					);
				},
			}}
		>
			{children}
		</HardenedMarkdown>
	);
}
