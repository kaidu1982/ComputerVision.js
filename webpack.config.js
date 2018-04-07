const path = require("path");
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry : path.resolve(__dirname, 'src/main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ComputerVision.js',
        library: "CV"
    },
    plugins: [
        new copyWebpackPlugin([
            {from: './public/**', to : path.resolve(__dirname, 'dist'), context: ''}
        ])
    ]
};

