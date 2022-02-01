import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
const input = './src/index.ts';

const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default {
  input: [
	input
  ],
  output: {
	file: pkg.main,
	format: 'esm',
	preserveModules: true,
	preserveModulesRoot: 'src',
	sourcemap: true,
  },
  plugins: [
	resolve(),
	commonjs(),
	typescript({
	  tsconfig: './tsconfig.build.json',
	  declaration: true,
	  declarationDir: 'dist',
	})
  ],
  external: ['react', 'react-dom'],
};
