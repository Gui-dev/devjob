import { app } from './app'

const PORT = Number(process.env.PORT || 3000)

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
