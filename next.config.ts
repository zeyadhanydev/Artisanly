import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			// unsplash images
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},

			// file upload using uploadthing
			{
				protocol: "https",
				hostname: "utfs.io",
			},
		],
	},
	experimental: {
		typedRoutes: true,
	},
};

export default nextConfig;
