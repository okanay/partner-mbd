import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static'
import fs from 'fs'
import crypto from 'crypto'
import { exec } from 'child_process'

const app = new Hono()

app.use(
  '/*',
  serveStatic({
    root: './dist/',
    getContent: path => {
      try {
        if (path.endsWith('.js') && !fs.existsSync(path)) {
          const tsPath = path.replace('.js', '.ts')
          if (fs.existsSync(tsPath)) {
            const file = fs.readFileSync(tsPath)
            return file
          }
        }

        const file = fs.readFileSync(path)
        if (!file) return null
        return file as any
      } catch (error) {
        if (path === 'dist/main/index.html' || path === 'dist/') {
          return null
        }
        return null
      }
    },
    onFound: (path, c) => {
      if (
        path.endsWith('.js') ||
        path.endsWith('.ts') ||
        path.endsWith('.css')
      ) {
        c.header(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, max-age=0',
        )
      }
    },
  }),
)

app.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store, no-cache')
  await next()
})

app.get('/', c => {
  const html = Bun.file('./dist/main/index.html')
  return c.html(html.text())
})

const secret = 'LHOUwjBFGyori4tltMnRQ2YtanvObPZOenCowk/Cq8c='

app.post('/github-push-event', async c => {
  const githubEvent = c.req.header('X-GitHub-Event')
  const signature = c.req.header('X-Hub-Signature-256')

  if (githubEvent !== 'push' || !signature) {
    return c.json({ error: 'Invalid event or missing signature' }, 400)
  }

  const payload = await c.req.text()
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const expectedSignature = `sha256=${hmac.digest('hex')}`

  if (signature !== expectedSignature) {
    return c.json({ error: 'Invalid signature' }, 401)
  }

  c.status(200)
  setImmediate(() => {
    runBuildProcess()
  })
  return c.body(null)
})

function runBuildProcess(): void {
  exec(
    'git pull && bun run build && sudo systemctl restart partner-mbd.service',
    { cwd: '/root/partner-mbd' },
    (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Exec error: ${error}`)
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`Command output: ${stdout}`)
    },
  )
}

const port = 3083
console.log(`Server is running on port ${port}`)

export default { fetch: app.fetch, port }
