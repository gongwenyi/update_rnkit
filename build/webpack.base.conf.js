const path = require('path'); // 路径管理插件
const webpack = require('webpack');
const config = require('../config');
const utils = require('./utils');

function resolve (dir) { // 缩写目录
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = { // webpack 基本配置导出
  context: path.resolve(__dirname, "../"), // 基础目录，绝对路径
  entry: {
    app: './src/main.js', // 入口
  },
  output: { // 输出
    path: config.build.assetsRoot, // 目标输出目录 path 的绝对路径
    filename: '[name].js', // 输出文件的文件名
    publicPath: process.env.NODE_ENV === 'production' // 该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  resolve: { // 模块路径配置(解析选项)
    extensions: ['.js', '.json', '.ts'], // 忽略某些文件类型拓展名
    alias: { // 指定某些的路径的简写
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'views': path.resolve(__dirname, '../src/views'),
      'api': path.resolve(__dirname, '../src/api'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
      'style': path.resolve(__dirname, '../src/style'),
      'static': path.resolve(__dirname, '../static'),
    }
  },
  plugins: [ // 添加插件（注：相同的插件不要重复引入，否则会报错）
    new webpack.ProvidePlugin({ // 通过 npm等 安装的插件（添加全局变量）
      jQuery: "jquery",
      $: "jquery",
      moment: "moment",
    }),
  ],
  module: {
    rules: [ // rules 也可以写成 loaders，但是 rules 是新的参数（对模块的源代码进行转换，类似于 gulp 的 task）
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.html$/, // html 文件处理
        use: [{
          loader: 'html-loader',
          options: { // 或可以使用 query 名称
            // minimize: false,
            attrs: ['img:src', 'audio:src', 'video:src', 'source:src'], // 拓展一些需要处理的 src，默认只有 'img:src'
          },
        }],
      },
      {
        test: /\.js$/, // js 文件处理
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        query: {
          presets: ['react', 'es2015']
        },
      },
      {
        test: /\.tsx?$/, // typeScript 文件处理
        loader: 'ts-loader',
        include: [resolve('src'), resolve('test')],
        options: { transpileOnly: false },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 图片处理
        loader: 'url-loader',
        options: {
          limit: 10000, // 上线不能查过 10000 bytes
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 音视频处理
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 字体处理
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        }
      },
    ]
  }
};