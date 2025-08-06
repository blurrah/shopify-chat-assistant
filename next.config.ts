import type { NextConfig } from "next";
import vercelToolbar from "@vercel/toolbar/plugins/next"
import { withRemoteComponents } from 'remote-components/next/config';
import { withMicrofrontends } from '@vercel/microfrontends/next/config';

const withVercelToolbar = vercelToolbar();

const nextConfig: NextConfig = {
	/* config options here */
};

export default withRemoteComponents(withMicrofrontends(withVercelToolbar(nextConfig)));
