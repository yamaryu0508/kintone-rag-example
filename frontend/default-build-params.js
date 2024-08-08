// import kintonePluginPackerPlugin from 'esbuild-kintone-plugin-packer-plugin';

export const defaultParams = {
  entryPoints: ['./src/ts/desktop.tsx'],
  outdir: 'dist/js',
  plugins: [
  ],
  bundle: true,
  minify: true,
  target: 'es2020',
  jsx: 'automatic',
  jsxImportSource: '@emotion/react'
};
