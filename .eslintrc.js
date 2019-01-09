module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-useless-escape' : 'off'
  },
  globals: {
    "gtag": true,
    "Swiper": true
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
