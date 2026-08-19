import { app } from './app.js'
import { config } from './config.js'
import { pool } from './db.js'

async function startServer() {
  try {
    await pool.query('SELECT 1')
    app.listen(config.port, () => {
      console.log(`Task Manager API is listening on http://localhost:${config.port}`)
    })
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error)
    process.exit(1)
  }
}

startServer()
