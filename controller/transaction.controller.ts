import { Request } from "express";
import { Response } from "express";
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./scratch");

type CreateAndUpdateTransactionBodyParams = {
  title: string;
  value: string;
  transactionType: number;
};

type RemoveTransactionBodyParams = {
  id: number;
};

export function transactionController() {
  function create(
    req: Request<{}, {}, CreateAndUpdateTransactionBodyParams>,
    res: Response
  ) {
    if (!req.body.title) {
      return res.status(400).json({ message: "Título obrigatório" });
    } else if (!req.body.value) {
      return res.status(400).json({ message: "Valor obrigatório" });
    } else if (!req.body.transactionType) {
      return res.status(400).json({ message: "Tipo de Transação obrigatório" });
    }

    const value = JSON.parse(localStorage.getItem("key")) || [];
    let arraySize = value.length;
    const item = value[arraySize - 1];
    let nextIndex = 1;
    if (item) {
      nextIndex = item.id + 1;
    }
    let data = {
      id: nextIndex,
      title: req.body.title,
      value: req.body.value,
      transactionType: req.body.transactionType,
    };

    value.push(data);
    localStorage.setItem("key", JSON.stringify(value));
    return res.status(201).json(data);
  }

  function read(req: Request<{}, {}>, res: Response) {
    const value = JSON.parse(localStorage.getItem("key")) || [];
    return res.json(value);
  }

  function readOnlyOne(
    req: Request<
      RemoveTransactionBodyParams,
      {},
      CreateAndUpdateTransactionBodyParams
    >,
    res: Response
  ) {
    const value = JSON.parse(localStorage.getItem("key")) || [];
    let index = value.findIndex(function (param: any) {
      return param.id == req.params.id;
    });

    return res.json(value[index]);
  }
  function update(
    req: Request<
      RemoveTransactionBodyParams,
      {},
      CreateAndUpdateTransactionBodyParams
    >,
    res: Response
  ) {
    const value = JSON.parse(localStorage.getItem("key")) || [];
    let index = value.findIndex(function (param: any) {
      return param.id == req.params.id;
    });
    value[index] = {
      id: value[index].id,
      title: req.body.title,
      value: req.body.value,
      transactionType: req.body.transactionType,
    };
    localStorage.setItem("key", JSON.stringify(value));
    return res.json(value[index]);
  }

  function remove(req: Request<RemoveTransactionBodyParams>, res: Response) {
    const value = JSON.parse(localStorage.getItem("key")) || [];
    let index = value.findIndex(function (param: any) {
      return param.id == req.params.id;
    });
    if (index > -1) {
      value.splice(index, 1);
      localStorage.setItem("key", JSON.stringify(value));
      return res.status(204).json();
    }
    return res.status(404).json({ message: "Transação não encontrada" });
  }

  return {
    create,
    read,
    update,
    remove,
    readOnlyOne,
  };
}
