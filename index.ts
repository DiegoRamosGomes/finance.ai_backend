import  express, {Express} from 'express'
import cors  from 'cors'
import  bodyParser  from 'body-parser'
import transactionController from './controller/transaction.controller.js'
import authController from './controller/auth.controller.js'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors());
app.use(bodyParser.json());

app.post('/transaction', transactionController.create) 
app.get('/transaction', transactionController.read) 
app.get('/transaction/:id', transactionController.readOnlyOne) 
app.put('/transaction/:id', transactionController.update) 
app.delete('/transaction/:id', transactionController.remove)

app.post('/auth/register', authController.register) 
app.post('/auth/login', authController.login) 
app.get('/auth/me', authController.getMe) 
app.put('/auth/me', authController.updateMe) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

