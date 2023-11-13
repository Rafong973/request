const terser = require('@rollup/plugin-terser')
const ts = require('rollup-plugin-ts')

module.exports = {
  input: 'src/index.ts',
  plugins: [
    ts({
      transpiler: {
        typescriptSyntax: 'typescript',
        otherSyntax: 'babel'
      }
    })
  ],
  output: [
    {
      file: 'bin/index.js',
      format: 'es'
    },
    {
      file: 'bin/index.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()]
    }
  ]
}
