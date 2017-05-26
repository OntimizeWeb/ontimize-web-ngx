const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
  ENV: ENV
});

module.exports = function (env) {
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
      } ]
    },

    plugins: [

      // new OptimizeJsPlugin({
      //   sourceMap: false
      // }),

      new CopyWebpackPlugin([
        { from: 'ontimize/components/material/styles/*.scss', to: '../' },
        { from: 'ontimize/components/material/*styles.scss', to: '../' },
        { from: 'ontimize/components/container/*o-container.component.scss', to: '../' },
        { from: 'ontimize/components/input/*input.scss', to: '../' },
        { from: 'ontimize/components/**/*-theme.scss', to: '../' },
        { from: 'ontimize/components/theming/*.scss', to: '../' }
      ]),

      /**
       * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
       */
      // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
      new UglifyJsPlugin({
        // beautify: true, //debug
        // mangle: false, //debug
        // dead_code: false, //debug
        // unused: false, //debug
        // deadCode: false, //debug
        // compress: {
        //   screw_ie8: true,
        //   keep_fnames: true,
        //   drop_debugger: false,
        //   dead_code: false,
        //   unused: false
        // }, // debug
        // // comments: true //debug
        // comments: false //debug
        beautify: false, //prod
        output: {
          comments: false
        }, //prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        }
      }),

      // /**
      //  * Plugin: NormalModuleReplacementPlugin
      //  * Description: Replace resources that matches resourceRegExp with newResource
      //  *
      //  * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
      //  */

      // // new NormalModuleReplacementPlugin(
      // //   /angular2-hmr/,
      // //   helpers.root('config/empty.js')
      // // ),

      // // new NormalModuleReplacementPlugin(
      // //   /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
      // //   helpers.root('config/empty.js')
      // // ),
      new LoaderOptionsPlugin({
        debug: true,
        options: {
        }
      })

      // new LoaderOptionsPlugin({
      //   minimize: true,
      //   debug: false,
      //   options: {
      //     /**
      //      * Html loader advanced options
      //      *
      //      * See: https://github.com/webpack/html-loader#advanced-options
      //      */
      //     // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
      //     htmlLoader: {
      //       minimize: true,
      //       removeAttributeQuotes: false,
      //       caseSensitive: true,
      //       customAttrSurround: [
      //         [/#/, /(?:)/],
      //         [/\*/, /(?:)/],
      //         [/\[?\(?/, /(?:)/]
      //       ],
      //       customAttrAssign: [/\)?\]?=/]
      //     },

      //   }
      // })
    ]
  });
}
