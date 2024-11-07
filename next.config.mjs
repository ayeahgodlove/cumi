/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@refinedev/antd"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.honeyman.shop",
        port: "",
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
};

export default nextConfig;
