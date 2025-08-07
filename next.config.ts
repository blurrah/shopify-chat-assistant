import type { NextConfig } from "next";
import vercelToolbar from "@vercel/toolbar/plugins/next";

const withVercelToolbar = vercelToolbar();

const nextConfig: NextConfig = {
	/* config options here */
};

export default withVercelToolbar(nextConfig);
