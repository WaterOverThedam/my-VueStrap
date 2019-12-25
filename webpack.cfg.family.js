var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    'family': './pages/family.js'
  },
  output: {
    path: './build',
    publicPath: 'build/',
    filename: '[name]_page_v4.js',
  },
  resolve: {
    root: path.resolve('./'),
    alias:{
      '@lib': path.resolve(__dirname,'docs/js'),
      '@': path.resolve(__dirname,'.')
    }
  },
  module: {
    loaders: [
      {test: /\.vue$/, loader: 'vue' },
      {
      	test: /\.js$/,
        exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
      	loader: 'babel'
      },
      {test: /\.css$/, loader: "style-loader!css-loader?root=./docs/" },
      {test: /\.scss$/, loader: "style!css!sass"},
      {test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  devtool: 'source-map'
//   devServer:{
//       //https:true,
//       contentBase:path.resolve(__dirname,'build'),//本地服务器加载的页面目录
// //       historyApiFallback:true,//不跳转
// //       compress:true,//服务器端开启压缩
//       port:'80',
//       inline:true,
//       host:true,
//       quiet:true 
//     }      
};

const argv = require('minimist')(process.argv.slice(2));
 

if (argv.env=== 'production') {
  delete module.exports.devtool;
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,  
      compress: {
        drop_console: true,
        warnings: false
      }
    })
  ];
}
 
