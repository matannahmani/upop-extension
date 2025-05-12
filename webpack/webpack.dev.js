const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { DefinePlugin } = require("webpack");

module.exports = merge(common, {
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new DefinePlugin({
      "process.env": {
        API_URL: JSON.stringify("http://localhost:3002"),
      },
    }),
  ],
});
