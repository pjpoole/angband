require('esbuild').build({
  entryPoints: ['./lib/browser/app.ts'],
  bundle: true,
  outfile: 'build/app.js',
  target: 'es2022',
  treeShaking: true
})
