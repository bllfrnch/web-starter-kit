import path from 'path';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import autoprefixer from 'autoprefixer';

// TODO: postcss/autoprefixer
// TODO: clean
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
  var loaders = [];

  loaders.push(mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader);
  loaders.push('css-loader');
  if (mode === 'production') loaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: () => autoprefixer({
        browsers: ['last 2 versions', '> 1%']
      })
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
