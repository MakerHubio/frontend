module.exports = {
  swcMinify: true,
  reactStrictMode: false,
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

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
