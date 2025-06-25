import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'dist/index.js',
  output: {
    file: 'build/bundle.min.js',
    format: 'cjs',
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      extensions: ['.mjs', '.js', '.json', '.node'],
    }),
    commonjs({
      ignoreDynamicRequires: true,
    }),
    json(),
    terser(),
  ],
  external: (id) => id.startsWith('node:'),
}
