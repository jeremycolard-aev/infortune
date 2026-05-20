/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/infortune',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
