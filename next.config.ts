import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'picsum.photos',
      'www.anilibria.tv',
      'anilibria.tv',
    ],
    remotePatterns: [
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
        source: '/api/external/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
      {
        source: '/api-storage/:path*',
        destination: 'http://localhost:8000/storage/:path*',
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
