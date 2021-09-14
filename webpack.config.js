const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.webpack.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PORT": JSON.stringify(process.env.PORT),
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    static: path.join(__dirname, "public"),
    hot: true,
  },
};
