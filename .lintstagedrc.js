const path = require('path')

const buildEslintCommand = (filename) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

const buildStylelintCommand = (filenames) =>
  `stylelint ${filenames
    .map((f) => path.relative(process.cwd, f))
    .join(' ')} --cache --cache-location ./node_modules/.cache/stylelint --fix`

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames
    .map((f) => path.relative(process.cwd, f))
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx,css,json,md}': [buildPrettierCommand],
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '*.css': [buildStylelintCommand],
}
