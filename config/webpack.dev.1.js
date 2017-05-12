const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const webpackMergeDll = webpackMerge.strategy({ plugins: 'replace' });
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

      // filename: '[name].umd.js',
      // sourceMapFilename: '[name].umd.map',
      // chunkFilename: '[id].chunk.js',

      // library: 'OntimizeWebNg2',
      // libraryTarget: 'umd',
      // umdNamedDefine: true
    },

    // require those dependencies but don't bundle them
    externals: [/^\@angular\//, /^rxjs\//],


    module: {

      loaders: [{
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            use: ['style-loader', 'css-loader', 'sass-loader'],
          })
        },
      ],


      rules: [ {
          // enforce: 'pre',
          // test: /\.ts$/,
          // loader: 'tslint-loader',
          // options: {
          //   configFile: 'tslint.json'
          // },
          // exclude: [helpers.root('node_modules')]
          test: /\.ts$/,
          use: [ {
              loader: 'tslint-loader',
              options: {
                configFile: 'tslint.json'
              }
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        }
        // ,
        // {
        //   test: /\.scss$/,
        //   use: ExtractTextPlugin.extract({
        //     use: ['style-loader', 'css-loader', 'sass-loader'],
        //   })
        // }

        // , {
        //   test: /\.css$/,
        //   use: ['style-loader', 'css-loader'],
        //   include: [helpers.root('ontimize')]
        // }, {
        //   test: /\.scss$/,
        //   use: ['style-loader', 'css-loader', 'sass-loader'],
        //   include: [helpers.root('ontimize')]
        // }, {
        //   test: /\.scss$/,
        //   use: [{
        //     loader: "style-loader"
        //   }, {
        //     loader: "css-loader",
        //     options: {
        //       sourceMap: true
        //     }
        //   }, {
        //     loader: "sass-loader",
        //     options: {
        //       sourceMap: true
        //     }
        //   }]
        // }
      ]
    },

    plugins: [

      new LoaderOptionsPlugin({
        debug: true,
        options: {
        }
      })
    ],

    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  });
}
