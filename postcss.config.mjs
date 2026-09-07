/** @type {import('postcss-load-config').Config} */
export default {
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
