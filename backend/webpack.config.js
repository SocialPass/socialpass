const path = require('path');

module.exports = {
  entry: {
    NFTCheckout: './static/js/NFTCheckout.js',
  },
  output: {
    path: path.resolve(__dirname, 'static/js/dist'),
    filename: 'bundle.js',
 },
};
