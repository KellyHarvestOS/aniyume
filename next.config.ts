import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'www.anilibria.tv',
      },
      {
        protocol: 'https',
        hostname: 'anilibria.tv',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api-storage/:path*',
        destination: `${process.env.STORAGE_PROXY_URL || 'http://127.0.0.1:8000'}/storage/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https: http:;
              font-src 'self' https: data:;
              frame-src 'self' https: http:;
              media-src 'self' blob: https://*.libria.fun;
              connect-src 'self' http://localhost:8000 ws: wss: https://*.libria.fun;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
