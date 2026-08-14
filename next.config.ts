import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api-pizzeria.sebastien-petit.fr',
                pathname: '/images/**',
            }
        ]
    }
};

export default nextConfig;
