const webpack = require('webpack');
const path = require('path');

process.env.NODE_ENV = 'development';

module.exports = [
    require('./webpack-emotion.config'),
    require('./webpack-linaria.config'),
    require('./webpack-css-modules.config'),
    require('./webpack-nostyles.config'),
];
