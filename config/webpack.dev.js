const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ngcWebpack = require('ngc-webpack');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
  ENV: ENV
});

module.exports = function (options) {
  return webpackMerge(commonConfig({ env: ENV }), {

    devtool: 'inline-source-map',

    output: {
      path: helpers.root('dist/bundles'),
      publicPath: '/',
      filename: '[name].umd.js',
      library: 'ontimize-web-ng2',
      libraryTarget: 'umd'
    },

    module: {
      rules: [{
        test: /\.ts$/,
        use: [{
          loader: 'tslint-loader',
          options: {
            configFile: 'tslint.json'
          }
        }
        ],
        exclude: [helpers.root('node_modules'), /\.(spec|e2e)\.ts$/,'@angular/compiler']
      }]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'ontimize/**/*.scss', to: '../' },
        { from: 'ontimize/**/*.html', to: '../' },
        { from: 'ontimize/components/table/vendor/**', to: '../' }
      ]),
      new ngcWebpack.NgcWebpackPlugin({
        disabled: false,
        //  disabled: !AOT,
        tsConfig: helpers.root('tsconfig.ngc.json'),
        resourceOverride: helpers.root('config/resource-override.js')
      }),
      new LoaderOptionsPlugin({
        debug: true,
        options: {
        }
      })
    ]
  });
}
