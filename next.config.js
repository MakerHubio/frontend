module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
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
