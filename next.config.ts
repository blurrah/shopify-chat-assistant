import vercelToolbar from "@vercel/toolbar/plugins/next";
import type { NextConfig } from "next";

const withVercelToolbar = vercelToolbar();

const nextConfig: NextConfig = {
	/* config options here */
};

export default withVercelToolbar(nextConfig);
