import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import queriesRoutes from './routes/queries.routes.js'
import authRouters from './routes/auth.routes.js'
import path from 'path';

const __dirname = path.resolve();

const app = express()
dotenv.config()
app.use(express.json())

app.use(cors())

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mysecret', // Cambia esto por un secreto seguro
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Cambia a true si usas HTTPS
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(queriesRoutes)
app.use(authRouters)
export default app;