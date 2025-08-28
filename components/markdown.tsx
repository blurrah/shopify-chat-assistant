import ReactMarkdown from "react-markdown";
import hardenReactMarkdown from "harden-react-markdown";
import { allowedImagePrefixes, allowedOrigins } from "@/lib/ai";

// Uses harden-react-markdown to prevent prompt injection and other attack vectors
const HardenedMarkdown = hardenReactMarkdown(ReactMarkdown);

export function Markdown({ children }: { children: string }) {
	console.log("markdown", children);
	return (
		<HardenedMarkdown
			defaultOrigin="https://shopify-chat-assistant.vercel.app"
			allowedLinkPrefixes={allowedOrigins}
			allowedImagePrefixes={allowedImagePrefixes}
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
				// We are already showing the images in the product carousel, so we don't need to show them here
				// trying to prompt them away but no luck yet
				img: ({ src, alt }) => {
					return <span className="block my-4" />;
				},
			}}
		>
			{children}
		</HardenedMarkdown>
	);
}
