import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
})