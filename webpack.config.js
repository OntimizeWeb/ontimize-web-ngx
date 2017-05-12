/**
 * Adapted from angular2-webpack-starter
 */

const helpers = require('./config/helpers'),
  webpack = require('webpack');


/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

const AOT = helpers.hasNpmFlag('aot');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },

  entry: helpers.root('index.ts'),

  output: {
    path: helpers.root('dist/bundles'),
    publicPath: '/',
    filename: 'ontimize-web-ng2.umd.js',
    library: 'ontimize-web-ng2',
    libraryTarget: 'umd'
  },

  externals: [/^\@angular\//, /^rxjs\//],

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: [helpers.root('node_modules')]
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      options: {
        configFileName: 'tsconfig-build.json'
      },
      exclude: [/\.(spec|e2e)\.ts$/]
    }, {
      test: /\.ts$/,
      loader: 'angular2-template-loader',
      exclude: [/\.(spec|e2e)\.ts$/]
    },
    //  {
    //   test: /\.tsx?$/,
    //   loader: 'ts-loader',
    //   options: {
    //     // compiler: 'ntypescript',
    //     configFileName: 'tsconfig-build.json'
    //   }
    // },
    {
      test: /\.scss$/,
      use: ['to-string-loader', 'css-loader', 'sass-loader'],
      include: [helpers.root('ontimize')]
    }, {
      test: /\.html$/,
      use: 'raw-loader'
    }]
  },

  plugins: [
    // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./ontimize')
    ),

    new webpack.LoaderOptionsPlugin({
      options: {
        tslintLoader: {
          emitErrors: false,
          failOnHint: false
        },
        sassLoader: {
        }
      }
    }),

    new CopyWebpackPlugin([
      //   // { from: 'config', to: '../config' },
      { from: 'CHANGELOG.md', to: '../' },
      { from: 'LICENSE', to: '../' },
      { from: 'README.md', to: '../' },
      { from: 'package.json', to: '../' },
      { from: 'ontimize.scss', to: '../' }
      // ,

      // { from: 'ontimize/**/*.scss', to: '../' },
      // { from: 'ontimize/**/*.html', to: '../' },
      // { from: 'ontimize/components/table/vendor/**', to: '../' }
    ]),

    // Reference: https://github.com/johnagan/clean-webpack-plugin
    // Removes the bundle folder before the build
    // new CleanWebpackPlugin(['bundles'], {
    //     root: helpers.root(),
    //     verbose: false,
    //     dry: false
    // })

    new ngcWebpack.NgcWebpackPlugin({
      // disabled: !AOT,
      tsConfig: helpers.root('tsconfig.webpack.json'),
      resourceOverride: helpers.root('config/resource-override.js')
    })
  ]
};
