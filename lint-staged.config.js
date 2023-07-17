const micromatch = require('micromatch')

module.exports = {
  '*': (allFiles) => {
    const commands = []

    const codeFiles = micromatch(allFiles, ['**/*.[jt]s?(x)'])
    if (codeFiles.length > 0) {
      commands.push(`prettier --write --list-different ${codeFiles.join(' ')}`)
      commands.push(`next lint --fix --file ${codeFiles.join(' --file ')}`)
    }

    const cssFiles = micromatch(allFiles, ['**/*.css'])
    if (cssFiles.length > 0) {
      commands.push(`prettier --write --list-different ${cssFiles.join(' ')}`)
      commands.push(
        `stylelint ${cssFiles.join(
          ' '
        )} --cache --cache-location ./node_modules/.cache/stylelint --fix`
      )
    }

    const miscFiles = micromatch(allFiles, ['**/*.md', '**/*.json'])
    if (miscFiles.length > 0) {
      commands.push(`prettier --write ${miscFiles.join(' ')}`)
    }

    return commands
  },
}
