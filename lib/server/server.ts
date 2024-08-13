import express from 'express'
import * as path from 'node:path'

// const STATIC_ROOT = path.join(__dirname, '..', '..', 'static')
const ASSETS_ROOT = path.join(__dirname, 'assets')

const PORT = 3000

const app: express.Application = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(ASSETS_ROOT, 'index.html'))
})

// app.use('/static', express.static(STATIC_ROOT))

app.listen(PORT, () => { console.log(`server started on port ${PORT}`)})
