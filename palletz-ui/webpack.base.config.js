'use strict';

const path = require('path');

module.exports = {
    // mode에 따라 enable/disable되는 plugin이 있다. 참조-> https://webpack.js.org/configuration/mode/#usage
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'   // [name]은 entry: 항목에 명시된 이름을 그대로 사용하겠다는 의미이다. webpack.main.config.js, webpack.renderer.config.js 파일을 참조.
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'source-map',      // 기존의 소스 코드를 디버깅하는 것처럼 최종 출력 파일을 디버깅 할 수 있다.
    plugins: [
    ]
};
