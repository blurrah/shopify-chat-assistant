import { Chat } from "@/components/chat";
import { debugFlag } from "@/lib/flags";

export default async function Home() {
	// TODO: Add precompute path for static chat view
	const isDebug = await debugFlag();

	return (
		<div className="h-screen w-full">
			<Chat isDebug={isDebug} />
		</div>
	);
}
