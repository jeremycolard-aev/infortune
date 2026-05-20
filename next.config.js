/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/infortune',
  assetPrefix: '/infortune/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
