import express from 'express'
import userRouter from './routes/user.routes'
import { databaseService } from './services/database.service'
import { defaultErrorHandler } from './middlewares/error.middleware'

const port = 3000
const app = express()

app.use(express.json())
databaseService.connect()

app.use('/users', userRouter)
app.use(defaultErrorHandler)

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
