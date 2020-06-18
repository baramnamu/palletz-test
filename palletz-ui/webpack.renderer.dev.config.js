const merge = require('webpack-merge');
const spawn = require('child_process').spawn;

const baseConfig = require('./webpack.renderer.config');

module.exports = merge.smart(baseConfig, {
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            // 공식 소스(1.X)에서는 아래 라인이 있어서 넣어 봤지만 이 라인의 설정 때문에 오류가 계속 발생하여 주석처리한다.
            // 'react-dom': '@hot-loader/react-dom'
        }
    },
    devServer: {
        port: 2003,
        compress: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        hot: true,  // Webpack의 Hot Module Replacement 기능 켬: 참조> https://webpack.js.org/guides/hot-module-replacement/
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        },
        before() {
            if (process.env.START_HOT) {
                console.log('Starting main process');
                spawn('npm', ['run', 'start-main-dev'], {
                    shell: true,
                    env: process.env,
                    stdio: 'inherit'
                })
                    .on('close', code => process.exit(code))
                    .on('error', spawnError => console.error(spawnError));
            }
        }
    }
});
