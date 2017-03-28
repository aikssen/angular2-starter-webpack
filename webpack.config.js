const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'app': `./src/main`,
    'vendor': `./src/vendor`
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.html']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader!angular2-template-loader',
        exclude: /node_modules/
      },
      /* Embed files. */
      { 
        test: /\.(html|css)$/, 
        loader: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      },
      /* Async loading. */
      {
        test: /\.async\.(html|css)$/, 
        loaders: ['file?name=[name].[hash].[ext]', 'extract']
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor.js'
    }),

    // Takes care of warnings described at https://github.com/angular/angular/issues/11580
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      './src', 
      {}
    ),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true
    }),

    new CopyWebpackPlugin([{ from: 'src/public/' }])
  ],

  // http dev server configuration
  // the basepath is taken from ouput.path (/dist)
  devServer: {
    historyApiFallback: true,
    compress: true, // gzip 
    inline: true,
    port: 3000,
    hot: true
  }
}