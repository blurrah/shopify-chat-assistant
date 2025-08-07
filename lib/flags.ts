import { flag } from "flags/next";

export const debugFlag = flag({
	key: "debug-flag",
	decide() {
		return false;
	},
});
