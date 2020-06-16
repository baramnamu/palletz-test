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
a                loaders: ['style-loader', 'css-loader']
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
                        loader: 'image-webpack-loader', // 이미지 파일을 압축/최적화한다.
                        options: {
                            disable: true   // webpack@2.x 이상의 debug 모드에서 일반적인 file-loader처럼 동작한다; 파일 압축/최적화 없음.
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.  이렇게 하면 기존의 TypeScript 소스 코드를 디버깅하는 것 처럼 최종 출력 파일을 디버깅 할 수 있습니다.
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
        // ForkTsCheckerWebpackPlugin 는 Typescript Error를 보고한다. Typescript로 React 개발시 필수.
        new ForkTsCheckerWebpackPlugin({
            reportFiles: ['src/renderer/**/*']
        }),
        //  NamedModulesPlugin은 development 모드에서 웹팩 파일 로그에, 상대 경로를 알려준다
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src/main/index.html'),
          inject: true, // <BODY> 밑으로 .js 파일이 삽입된다.
          filename: path.join(__dirname, 'dist/index.html')
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
});
