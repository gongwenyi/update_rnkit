process.env.NODE_ENV = 'production';

const path = require('path'); // 路径管理插件（node的插件，直接使用）
const merge = require('webpack-merge');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前清除之前的文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 用新生成的 index.html 文件替换原来的 index.html
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 提取相应的代码生成单独的文件（如css）
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩 css 文件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制静态文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 压缩 js 文件
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config');
const utils = require('./utils');

const prodWebpackConfig = merge(baseWebpackConfig, {
  entry: { // 入口起点
    app: './src/main.js', // 入口1
  },
  output: {
    path: config.build.assetsRoot, // 目标输出目录 path 的绝对路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'), // 输出文件的文件名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'), // 注：如果在页面中使用到了编译的依赖会导致 chunkhash 使用不了
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/prod.env'), // 此环境变量用于生产环境页面（编译过程不生效）
    }),
     // 打包前清除之前的文件(需要重置根目录) 注：build.js 已经删除了 static 目录，所以这里没有必要再次删除了
    // new CleanWebpackPlugin(['dist/static/', 'dist/*.*'], { root: path.resolve(__dirname, '..') }),
    new UglifyJsPlugin({ // 压缩 js 文件
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    new HtmlWebpackPlugin({ // 用新生成的 index.html 文件替换原来的 index.html（见下面介绍）
      // title: 'Output Management',
      filename: config.build.index, // 输出到指定的目录下
      template: 'index.html', // 是指根目录下的 index.html 文件
      inject: true, // 是否要把所有的资产注入到给定的 html 中
      minify: { // 传递HTML-minifier的选项对象来缩小输出
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去掉空格
        removeAttributeQuotes: true, // 去掉引用
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency', // 块的排序方式依靠依赖的顺序进行排序
    }),
    // extract css into its own file
    new ExtractTextPlugin({ // 生成独立的 css 文件
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({ // 压缩 css
      // cssProcessorOptions: {
      //   safe: true
      // }
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true },
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        // console.log('module==', module);
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([ // 复制静态文件
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
   ],
});

if (config.build.productionGzip) { // 是否添加压缩文件
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  prodWebpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', // 地址
      algorithm: 'gzip', // 压缩方式
      test: new RegExp( // 哪些需要压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, // 最大限值
      minRatio: 0.8, // 压缩比例
    })
  )
}

if (config.build.bundleAnalyzerReport) { // 是否需要打包分析报告
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = prodWebpackConfig;
