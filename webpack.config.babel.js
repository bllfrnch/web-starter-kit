import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import merge from 'webpack-merge';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * FEATURES
 * ============================
 * GLOBAL
 * ============================
 * DEVELOPMENT
 * ============================
 * PRODUCTION
 * ============================
 */

// XTODO: clean
// XTODO: Webpack dev server
// TODO: Hot module reloading <= this might be useful in a really big codebase, but my code is small
// and my modules are broken out across several chunks, so currently this seems like more trouble
// than it's worth.
// TODO: React/Vue
// XTODO: fonts
// XTODO: images
// TODO: assets/publicPath
// TODO: Linting
// xTODO: tree shaking is accomplished by setting the sideEffects property in package.json.
// TODO: source maps prod?
// xTODO: source maps dev
// xTODO: splitting main/vendor code
// XTODO: hashing prod files
// XTODO: CSS minification
// XTODO: minification – uglify? babel minify?
// TODO: client/server set up version (separate config)
// TODO: Polyfills for promises, array functions



/**
 * Returns the styling rule configuration for the rules array. Depends on what mode the webpack
 * is being called with.
 */
const cssRule = (mode) => {
  var loaders = [];

  loaders.push(mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader);
  loaders.push('css-loader');
  if (mode === 'production') loaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: [
        cssnano({
          preset: 'default'
        }),
        autoprefixer({
          browsers: ['last 2 versions', '> 1%']
        })
      ]
    }
  });
  loaders.push('sass-loader');

  return {
    test: /\.s?css$/,
    use: loaders,
  };
};

let config = {
  entry: './src/js/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
  },
  devServer: {
    contentBase: './build',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  }
};

export default (env, argv) => {
  let mergedConfig = argv.mode !== 'production'
    ? merge(config, {
        devtool: 'source-map',
        module: {
          rules: [
            cssRule(argv.mode)
          ]
        },
        plugins: [
          // new webpack.HotModuleReplacementPlugin()
        ]
      })
    : merge(config, {
        module: {
          rules: [
            cssRule(argv.mode)
          ],
        },
        plugins: [
          new CleanWebpackPlugin(['build']),
          new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash].css',
          }),
        ],
      });

  return mergedConfig;
};
