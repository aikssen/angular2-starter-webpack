const webpack = require("webpack");
const path = require('path');

const ccpOptions = {
  name: 'vendor',
  filename: './dist/vendor.bundle.js'
};

function root(__path) {
  return path.join(__dirname, __path);
}

module.exports = {
  entry: {
    "vendor": "./src/vendor",
    "app": "./src/main"
  },
  output: {
    path: __dirname,
    filename: "./dist/js/[name].bundle.js"
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve('./app'),
      'node_modules'
    ]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(ccpOptions),

    // Takes care of warnings described at https://github.com/angular/angular/issues/11580
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      root('./src'),
      { }
    ),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true
    })
  ],
  devServer: {
    historyApiFallback: true,
    compress: true,
    inline: true,
    port: 3000,
    publicPath: __dirname + '/dist',
    contentBase: __dirname + '/dist'
  }
}
