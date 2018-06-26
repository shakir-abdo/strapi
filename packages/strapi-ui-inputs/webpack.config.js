const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: true,
  });

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'lib'),
        exclude: /(node_modules|bower_components|build)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              [
                require.resolve('babel-preset-env'),
                {
                  es2015: {
                    modules: false,
                  },
                },
              ],
              require.resolve('babel-preset-react'),
              require.resolve('babel-preset-stage-0'),
            ]
          },
        }],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: extractSass.extract({
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                minimize: process.env.NODE_ENV === 'production',
                sourceMap: false,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss', 'postcss.config.js'),
                },
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'lib'),
        use: extractSass.extract({
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {            
                sourceMap: false,
                minimize: process.env.NODE_ENV === 'production',
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss', 'postcss.config.js'),
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: require.resolve('style-loader'),
        }),
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          require.resolve('file-loader'),
          {
            loader: require.resolve('image-webpack-loader'),
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: require.resolve('html-loader'),
      },
      {
        test: /\.(mp4|webm)$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
        },
      },
    ]
  },
  externals: {
    'react': 'commonjs react'
  },
  plugins: [extractSass],
};