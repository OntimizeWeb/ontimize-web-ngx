const webpack = require('webpack');
const helpers = require('./helpers');

/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

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
      extensions: ['.ts', '.tsx', '.js', '.html']
    },
    module: {
      rules: [{
          test: /\.ts$/,
          use: [{
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig-build.json'
              }
            }, {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },{
          test: /\.scss$/,
          use: ['to-string-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('./ontimize')]
        }, {
          test: /\.html$/,
          use: 'raw-loader'
        }
      ]
    },

    plugins: [
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
      ])
    ]
  };
}
