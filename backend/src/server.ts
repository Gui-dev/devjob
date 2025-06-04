import { app } from './app'
import { env } from './lib/env'

const PORT = env.PORT

app
  .listen({
    port: PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
  })
  .catch(err => {
    console.error(err)
  })
