import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME_1 || '',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
