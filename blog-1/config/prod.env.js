'use strict'
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  NODE_ENV: '"production"',
  //移除console插件
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"]
        }
      }
    })
  ]
}
