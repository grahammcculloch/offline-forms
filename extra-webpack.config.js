const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  resolve: {},
  plugins: [

    new WorkboxPlugin.InjectManifest({
      swSrc: './src/sw.js',
      globPatterns: [
        '**/*.{js,css,json,html,ico,png,svg}'
      ]
    })
  ],
  module: {}
}
