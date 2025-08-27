import { Chat } from "@/components/chat";
import { debugFlag } from "@/lib/flags";
import { RemoteComponent } from "remote-components/next/host";

export default async function Home() {
	// TODO: Add precompute path for static chat view
	const isDebug = await debugFlag();

	return (
		<div className="h-screen w-full">
			<RemoteComponent src="/components/bla/product-details" />
			<Chat isDebug={isDebug} />
		</div>
	);
}
