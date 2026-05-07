/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: 'http://69.62.80.189/wp-content/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig
