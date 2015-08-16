/**
 * Created by minxiao on 15/8/15.
 */

var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var fixedDirectoryDescriptionFilePlugin = require('webpack-bower-resolver');


function getEntry(){
    var entry = {};
    glob.sync(__dirname+'/src/*.js').forEach(function(name){
        var n = name.match(/([^/]+?)\.js/)[1];
        entry[n] = './src/'+n+'.js';
    });
    console.dir(entry);
    return entry;
}

module.exports = {
    refreshEntry: function () {
        this.entry = getEntry();
    },
    context:__dirname+'/',
    devtool:'source-map',//source-map
    entry:getEntry(),
    resolve:{
        modulesDirectories: [
            'node_modules',
            'bower_components',
            'lib'
        ]
    },
    output:{
        path:path.join(__dirname,'dist'),
        filename:'[name].js',
        publicPath:'/static'/*,
        sourceMapFilename:'[file].map'*/
    },
    plugins:[
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        new webpack.ResolverPlugin(
            new fixedDirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
        //commonsPlugin
    ]/*,
    resolve:{
        extensions: ['', '.js']
    },
    module:{
        loaders:[
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                exclude: /node_modules/
            },
            {
                test: /\.css?$/,
                loaders: ['style', 'raw']
            }
        ]
    }*/
};