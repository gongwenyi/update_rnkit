// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // 全局变量
  'globals': {
    // 'document': true,
    '$': false, // false：全局变量不能被改写，true：全局变量可以被改写
    'jQuery': false,
    'moment': false,
    'actions': false,
    'storage': false,
    'jwt': false,
    'funs': false,
  },
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'max-len': [1, 30000],   //强制行的最大长度 (max-len)。 fix
    'linebreak-style': 0,
    'no-console': 0,
    'no-param-reassign': 0, // 强行可以修改函数的传参
    'no-plusplus': 0, // 使用++和--自增和自减运算符
    'no-mixed-operators': 0, // 使用混合操作符
    'no-nested-ternary': 0, // 使用嵌套的三元表达式
    'camelcase': 0, // 不强制使用驼峰命名法（有时候需要使用下划线_分隔）
    'newline-per-chained-call': 0, // 不强制链式调用使用换行符
    'no-unused-vars': 0, // 去掉定义了变量却未使用
    'class-methods-use-this': 0, // 不强制类方法中使用this
    'object-curly-newline': 0, // 不提示对象需要写多行
    'global-require': 0, // 不强制不能在代码中调用require
    'arrow-body-style': 0, // 函数内格式不强制
    'object-property-newline': 0, // 不强制对象换行
    'function-paren-newline': 0, // 不强制一定不换行
  }
}
