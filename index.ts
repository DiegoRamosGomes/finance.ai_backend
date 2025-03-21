import  express, {Express} from 'express'
import cors  from 'cors'
import  bodyParser  from 'body-parser'
import transactionController from './controller/transaction.controller.js'
const app: Express = express()
const port =2077
app.use(cors());
app.use(bodyParser.json());


app.post('/transaction', transactionController.test) 
app.get('/transaction', transactionController.read) 
app.get('/transaction/:id', transactionController.readOnlyOne) 
app.put('/transaction/:id', transactionController.update) 
app.delete('/transaction/:id', transactionController.remove)

app.post('/auth', transactionController().create) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

