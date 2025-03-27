import  express, {Express} from 'express'
import cors  from 'cors'
import  bodyParser  from 'body-parser'
import transactionController from './controller/transaction.controller'
import authController from './controller/auth.controller'
import dotenv from 'dotenv'
import { authMiddleware } from './middlewares/auth.middleware'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())

app.get('/', (_, res) => {
  res.json({
    ok: true
  })
  return 
})
app.post('/transaction', authMiddleware, transactionController.create) 
app.get('/transaction', authMiddleware, transactionController.read) 
app.get('/transaction/:id', authMiddleware, transactionController.readOnlyOne) 
app.put('/transaction/:id', authMiddleware, transactionController.update) 
app.delete('/transaction/:id', authMiddleware, transactionController.remove)

app.post('/auth/register', authController.register) 
app.post('/auth/login', authController.login) 
app.get('/auth/me', authMiddleware, authController.getMe) 
app.put('/auth/me', authMiddleware, authController.updateMe) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

