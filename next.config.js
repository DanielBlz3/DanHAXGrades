/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/matches',
        destination: '/matches/lineups',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
