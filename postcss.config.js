/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-sort-media-queries': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: false,
      },
      features: {
        'nesting-rules': false,
      },
    },
  },
}
