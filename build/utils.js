const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
}

exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = { // 处理 css
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    }
  }

  const postcssLoader = { // 处理 postcss
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    }
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) { // 处理其他 css
    // var loaders = [cssLoader]
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({ // 提取 css 部分
        use: loaders,
        // fallback: 'vue-style-loader', // 针对 vue 使用的 loader
        fallback: 'style-loader', // 针对普通 style 标签使用的 loader
      });
    } else {
      // return ['vue-style-loader'].concat(loaders); // 针对 vue 使用的 loader
      return ['style-loader'].concat(loaders); // 针对普通 style 标签使用的 loader
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output;
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();
    const packageConfig = require('../package.json');

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'editDisabled.png'),
    })
  }
}
