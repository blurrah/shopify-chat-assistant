import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import { debugFlag } from "@/lib/flags";

export const GET = createFlagsDiscoveryEndpoint(() =>
	getProviderData([debugFlag]),
);
