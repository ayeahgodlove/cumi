/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@refinedev/antd"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.honeyman.shop',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
