'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// If your port is set to 80,

const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    'publicPath': './',
    'outputDir': 'dist',
    'assetsDir': 'static',
    'lintOnSave': false,
    'productionSourceMap': false,
    'devServer': {
        'port': 9528,
        'open': true,
        'overlay': {
            'warnings': false,
            'errors': true
        }
    },
    'configureWebpack': {
        'name': 'D20F 文档',
        'resolve': {
            'alias': {
                '@': resolve('src')
            }
        }
    },
    'transpileDependencies': [
        'vuetify'
    ]
}
