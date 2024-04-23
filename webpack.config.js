const path = require('path');

module.exports = {
  entry: ['./static/js/NFTCheckoutWagmi.js'],
  output: {
    path: path.resolve(__dirname, 'static/js/dist'),
    filename: 'bundle.js',
 },
};
