const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path')

const baseConfig = require('./webpack.base.config');

module.exports = merge.smart(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: ['@babel/polyfill','./src/renderer/app.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            { targets: { browsers: 'last 2 versions ' } }
                        ],
                        '@babel/preset-typescript',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ['@babel/plugin-syntax-dynamic-import']
                    ]
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2)(\?.+)?$/,
                loader: 'file-loader?name=[hash:12].[ext]'
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg?$/,
                use: ['@svgr/webpack']
            },
            {
                test: /\.(gif|png|jpe?g)$/,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.(js|ts|tsx)$/,
                loader: 'source-map-loader',
                exclude: [
                  'qrcode', 'pzsc'
                ].map(v => path.resolve(__dirname, `./node_modules/${v}`))
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            reportFiles: ['src/renderer/**/*']
        }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src/main/index.html'),
          inject: true,
          filename: path.join(__dirname, 'dist/index.html')
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
});
