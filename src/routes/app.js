import dotenv from 'dotenv'
import express from 'express'
import usersRoutes from './routes/users.routes.js'
import authRouters from './routes/auth.routes.js'


const app = express()
dotenv.config()
app.use(express.json())
app.use(usersRoutes)
app.use(authRouters)

export default app;