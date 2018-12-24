const path = require("path");
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    return {
        mode: env,
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
    }

};

