import path from 'path';
import webpack from 'webpack';

export default {
  entry: ['./src/app.js'],
  target: 'web',
  cache: true,
  debug: true,
  context: path.resolve(__dirname),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    pathinfo: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.json']
  },
  module: {
    loaders: [
      { // for the babel-loader config, see the .babelrc file in the G2.web/UI folder
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel?cacheDirectory=true']
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
