import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { builtinModules, SourceMap } from 'module' // For externalizing Node.js built-in modules

export default {
  input: 'dist/index.js', // Entry file
  output: {
    file: 'build/bundle.js', // Output file
    format: 'cjs', // CommonJS format
    inlineDynamicImports: true, // Inline all dynamic imports into a single file
    sourcemap: true,
  },
  plugins: [
    resolve({
      preferBuiltins: true, // Prefer Node.js built-in modules
      extensions: ['.mjs', '.js', '.json', '.node'],
    }),
    commonjs({
      ignoreDynamicRequires: true,
    }), // Converts CommonJS modules to ES6
    json(), // Add this plugin to handle JSON imports
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'), // Replace environment variables
    }),
  ],
  external: ['pg-hstore'],
}
