const path = require('path');

module.exports = {
   entry: "./src/td-tools.ts",
   output: {
       filename: "node-wot-td-tools.bundle.js",
       path: path.resolve(__dirname, 'dist'),
       library: "NodeWotTdTools"
   },
   resolve: {
       extensions: [".ts", ".js"]
   },
   module: {
       loaders: [{ test: /\.ts$/, loader: "ts-loader" }]
   }
}
