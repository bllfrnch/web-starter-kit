import path from 'path';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// TODO: postcss/autoprefixer
// TODO: Webpack dev server
// TODO: Hot module reloading
// TODO: React/Vue
// TODO: images/assets/publicPath
// TODO: Linting
// TODO: minification – ugligy? babel minify?

/**
 * Returns the styling rule configuration for the rules array. Depends on what mode the webpack
 * is being called with.
 */
const cssRule = (mode) => {
  return {
    test: /\.s?css$/,
    use: [
      // creates style nodes from JS strings
      mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader', // translates CSS into CommonJS
      'sass-loader' // compiles Sass to CSS
    ]};
}

let config = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};

export default (env, argv) => {
  let mergedConfig = argv.mode === 'development'
    ? merge(config, {
        devtool: 'source-map',
        module: {
          rules: [
            cssRule(argv.mode)
          ]
        }
      })
    : merge(config, {
        module: {
          rules: [
            cssRule(argv.mode)
          ],
        },
        plugins: [
          new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'style.[contenthash].css',
          })
        ]
      });

  return mergedConfig;
};
