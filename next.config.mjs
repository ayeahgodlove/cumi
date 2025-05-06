/** @type {import('next').NextConfig} */
import { createRequire } from "module";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  trailingSlash: false,
  transpilePackages: ["@refinedev/antd"],
  productionBrowserSourceMaps: false,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
  crossOrigin: "anonymous",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules\/(?!sequelize)/,
      },
    ],
  },
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
  swcMinify: true,
  compress: true,
  optimizeFonts: true,
  webpack(config, { isServer, dev }) {
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: "all",
      };
    }
    return config;
  },
});

export default nextConfig;
