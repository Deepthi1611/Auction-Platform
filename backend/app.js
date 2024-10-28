import { config } from 'dotenv';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import { connection } from './database/connection.js';
import { errorMiddleware } from './middlewares/error.js';
import userRouter from './routers/user.js'

// creating app
const app = express();

// configuring env
config({
    path:'./config/config.env'
})

// configure cors
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}))

// configure cookie parser
app.use(cookieParser())
// body parser to parse JSON data
app.use(express.json())
// This middleware is used to parse incoming URL-encoded data from HTML forms, making it available in req.body.
// extended: true: This option allows the parser to handle complex data structures, such as nested objects. 
app.use(express.urlencoded({extended: true}))
// This middleware, provided by the express-fileupload package, is used to handle file uploads.
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/'
}))

// configure routers
app.use("/api/v1/user", userRouter)

connection()

// include error middleware
app.use(errorMiddleware)

export default app