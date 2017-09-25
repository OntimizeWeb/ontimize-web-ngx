const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const ngcWebpack = require('ngc-webpack');
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
        exclude: [helpers.root('node_modules'), /\.(spec|e2e)\.ts$/, '@angular/compiler']
      }]
    },

    plugins: [

      // new OptimizeJsPlugin({
      //   sourceMap: false
      // }),

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

      new LoaderOptionsPlugin({
        debug: true,
        options: {
        }
      }),

      new ngcWebpack.NgcWebpackPlugin({
        disabled: false,
        //  disabled: !AOT,
        tsConfig: helpers.root('tsconfig.ngc.json'),
        resourceOverride: helpers.root('config/resource-override.js')
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
