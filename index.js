import  express  from 'express'
import cors  from 'cors'
import  bodyParser  from 'body-parser'
import { transactionController } from './controller/transaction.controller.js'
const app = express()
const port =2077
app.use(cors());
app.use(bodyParser.json());


app.post('/transaction', transactionController().create) 
app.get('/transaction/:id', transactionController().read) 
app.get('/transaction', transactionController().readOnlyOne) 
app.put('/transaction', transactionController().update) 
app.delete('/transaction', transactionController().remove) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})