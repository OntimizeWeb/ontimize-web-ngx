const webpack = require('webpack');
const helpers = require('./helpers');

/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ngcWebpack = require('ngc-webpack');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

/*
 * Webpack Constants
 */
const AOT = helpers.hasNpmFlag('aot');
const METADATA = {
  title: 'Ontimize web ng2 webpack',
  baseUrl: '/',
  isDevServer: false
};

module.exports = function (options) {
  isProd = options.env === 'production';
  return {

    entry: {
      'ontimize-web-ng2': helpers.root('index.ts')
    },
    resolve: {
      extensions: ['.ts', '.js', '.html']
    },
    module: {
      rules: [

        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader?configFileName=tsconfig-webpack.json', 'angular2-template-loader'],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        /* Embed files. */
        {
          test: /\.(html|css)$/,
          loader: 'raw-loader',
          exclude: /\.async\.(html|css)$/
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('ontimize')]
        },

        {
          test: /\.(ts|js)$/,
          loader: 'source-map-loader',
          exclude: [
            // these packages have problems with their sourcemaps
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular')
          ]
        }
        // , {
        //   test: /\.json$/,
        //   use: 'json-loader'
        // }, {
        //   test: /\.css$/,
        //   use: ['to-string-loader', 'css-loader'],
        //   include: [helpers.root('ontimize')]
        // }, {
        //   test: /\.(jpg|png|gif)$/,
        //   use: 'file-loader'
        // }, {
        //   test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
        //   use: 'file-loader'
        // }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        jQuery: "jquery"
      }),

      new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('./ontimize')
      ),

      new CopyWebpackPlugin([
        // { from: 'config', to: '../config' },
        { from: 'CHANGELOG.md', to: '../' },
        { from: 'LICENSE', to: '../' },
        { from: 'README.md', to: '../' },
        { from: 'package.json', to: '../' },
        { from: 'ontimize.scss', to: '../' },
        { from: 'ontimize/**/*.scss', to: '../' },
        { from: 'ontimize/**/*.html', to: '../' },
        { from: 'ontimize/components/table/vendor/**', to: '../' }
        // ,
        // { from: 'dist1/**/*.metadata.json', to: '../../dist' }
      ]),
      //

      // new AssetsPlugin({
      //   path: helpers.root('dist'),
      //   filename: 'webpack-assets.json',
      //   prettyPrint: true
      // }),


      // new HtmlElementsPlugin({
      //   headTags: require('./head-config.common')
      // }),

      // new LoaderOptionsPlugin({}),

      // // Fix Angular 2
      // new NormalModuleReplacementPlugin(
      //   /facade(\\|\/)async/,
      //   helpers.root('node_modules/@angular/core/src/facade/async.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /facade(\\|\/)collection/,
      //   helpers.root('node_modules/@angular/core/src/facade/collection.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /facade(\\|\/)errors/,
      //   helpers.root('node_modules/@angular/core/src/facade/errors.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /facade(\\|\/)lang/,
      //   helpers.root('node_modules/@angular/core/src/facade/lang.js')
      // ),
      // new NormalModuleReplacementPlugin(
      //   /facade(\\|\/)math/,
      //   helpers.root('node_modules/@angular/core/src/facade/math.js')
      // ),

      new ngcWebpack.NgcWebpackPlugin({
        disabled: false,
        //  disabled: !AOT,
        tsConfig: helpers.root('tsconfig.ngc.json'),
        resourceOverride: helpers.root('config/resource-override.js')
      })

    ]
    // ,

    // node: {
    //   global: true,
    //   crypto: 'empty',
    //   process: true,
    //   module: false,
    //   clearImmediate: false,
    //   setImmediate: false
    // }

  };
}
