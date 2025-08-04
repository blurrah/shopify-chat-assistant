import { Chat } from "@/components/chat";
import { debugFlag } from "@/lib/flags";

export default async function Home() {
	const isDebug = await debugFlag()

	return (
		<div className="h-screen w-full">
			<Chat isDebug={isDebug} />
		</div>
	);
}
