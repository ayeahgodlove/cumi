/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // Enables bundle analysis when ANALYZE=true
});

const nextConfig = withBundleAnalyzer({
  transpilePackages: ["@refinedev/antd"],
  productionBrowserSourceMaps: false,
  // headers: () => {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value:
  //             "http://localhost:3000, https://cumitech.com, https://www.cumitech.com",
  //         },
  //         { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "Content-Type, Authorization",
  //         },
  //       ],
  //     },
  //   ];
  // },
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
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
    return config;
  },
});

export default nextConfig;
