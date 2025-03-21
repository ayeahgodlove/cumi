/** @type {import('next').NextConfig} */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  trailingSlash: true,
  transpilePackages: ["@refinedev/antd"],
  // output: "standalone",
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
  ignoreWarnings: [
    {
      message:
        /Critical dependency: the request of a dependency is an expression/,
    },
  ],
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all", // Improve code splitting
    };
    // config.resolve.fallback = {
    //   crypto: require.resolve("crypto-browserify"),
    //   stream: require.resolve("stream-browserify"),
    //   buffer: require.resolve("buffer"),
    // };
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   crypto: require.resolve("crypto-browserify"),
    // };
    return config;
  },
});

export default nextConfig;