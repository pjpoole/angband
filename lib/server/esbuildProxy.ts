import * as esbuild from 'esbuild'
import http from 'node:http'
import type express from 'express'

let ctx: esbuild.BuildContext, host: string, port: number

async function startEsBuild() {
  ctx = await esbuild.context({
    bundle: true,
    entryPoints: ['./lib/browser/app.ts'],
    outfile: 'build/app.js',
    target: 'es2022'
  })

  const result = await ctx.serve({ servedir: '.' })

  host = result.host
  port = result.port

  console.log(`esbuild proxy started on port ${port}`)
}

export async function doEsBuildProxy(req: express.Request, res: express.Response) {
  if (ctx == null) {
    await startEsBuild()
  }

  const options = {
    hostname: host,
    port: port,
    // TODO: janky
    path: req.url.replace(/^\/static/, '/build'),
    method: req.method,
    headers: req.headers,
  }

  // Forward each incoming request to esbuild
  const proxyReq = http.request(options, proxyRes => {
    // If esbuild returns "not found", send a custom 404 page
    if (proxyRes.statusCode === 404) {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('<h1>Not Found</h1>')
      return
    }

    // Not perfect
    proxyRes.statusCode ??= 500

    // Otherwise, forward the response from esbuild to the client
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res, { end: true })
  })

  // Forward the body of the request to esbuild
  req.pipe(proxyReq, { end: true })
}
