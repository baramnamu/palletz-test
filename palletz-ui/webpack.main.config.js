const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const baseConfig = require('./webpack.base.config')

module.exports = merge.smart(baseConfig, {
  target: 'electron-main',    // target은 개발 대상 환경을 지정한다. 예: web, webworker, node, node-webkit, electron-renderer, async-node, ...
  entry: {
    main: './src/main/main.ts'
  },
  externals: {
    pcsclite: 'commonjs pcsclite',
    'pzfinger-native': 'commonjs pzfinger-native',
    'pzburn-native': 'commonjs pzburn-native'
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
              '@babel/preset-env',  // 웹브라우저 버전별로 최적화시켜준다. 아래 targets: 옵션에 타겟 브라우저 종류를 명시한다. 참조: https://browserl.ist/
              { targets: 'maintained node versions' }
            ],
            '@babel/preset-typescript'
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }]  // loose: true 로 셋팅하면 클래스 속성을 Object.propertyName = value 형식으로 속성을 추가한다.
          ]
        }
      }
    ]
  },
  plugins: [
    // ForkTsCheckerWebpackPlugin 는 Typescript Error를 보고한다. Typescript로 React 개발시 필수.
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ['src/main/**/*']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new CopyPlugin([
      'src/main/slotmanager.exe'
    ])
  ]
})
