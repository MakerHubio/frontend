module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputStandalone: true,
  },
  async redirects() {
    return [
      {
        source: '/user/:id',
        destination: '/user/:id/profile',
        permanent: true,
      },
    ]
  },
};
