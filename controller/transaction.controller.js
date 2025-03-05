import { LocalStorage } from 'node-localstorage'
const localStorage = new LocalStorage('./scratch');

export function transactionController(){
    function create(req, res){
      //  localStorage.setItem('key', JSON.stringify(req.body))
        const value = JSON.parse(localStorage.getItem('key'))
        return res.json(value)

        let data = {
            title,
            value,
            transactionType,
        }
    }

    function read(req, res){

    }

    function readOnlyOne(req, res){

    }

    function update(req, res){

    }

    function remove(req, res){

    }

    return {
        create,
        read,
        update,
        remove,
        readOnlyOne
    }
}