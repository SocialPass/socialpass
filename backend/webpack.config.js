const path = require('path');

module.exports = {
  entry: {
    'NFTCheckout': './static/js/NFTCheckoutWagmi.js',
    'ImageUpload': './static/js/imageUpload.js',
  },
  output: {
      path: path.resolve(__dirname, 'static/js/dist'),
      filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};