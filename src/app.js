import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import usersRoutes from './routes/users.routes.js'
import authRouters from './routes/auth.routes.js'


const app = express()
dotenv.config()
app.use(express.json())

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mysecret', // Cambia esto por un secreto seguro
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Cambia a true si usas HTTPS
    })
);
app.use(usersRoutes)
app.use(authRouters)
export default app;