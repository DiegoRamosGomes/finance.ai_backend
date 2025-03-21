import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage("./scratch");

type CreateAndUpdateTransactionBodyParams = {
  title: string;
  value: string;
  transactionType: number;
  date: string;
};

type RemoveTransactionParams = {
  id: string;
};

function create(
  req: Request<{}, {}, CreateAndUpdateTransactionBodyParams>,
  res: Response
) {
  const { title, value, transactionType, date } = req.body;
  if (!title || !value || transactionType === undefined || !date) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const nextId =
    transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1;

  const newTransaction = { id: nextId, title, value, transactionType, date };
  transactions.push(newTransaction);
  localStorage.setItem("key", JSON.stringify(transactions));

  return res.status(201).json(newTransaction);
}

function read(req: Request, res: Response) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  return res.json(transactions);
}

function readOnlyOne(req: Request<RemoveTransactionParams>, res: Response) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const transaction = transactions.find(
    (t: any) => t.id === Number(req.params.id)
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transação não encontrada" });
  }
  return res.json(transaction);
}

function update(
  req: Request<
    RemoveTransactionParams,
    {},
    CreateAndUpdateTransactionBodyParams
  >,
  res: Response
) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const index = transactions.findIndex(
    (t: any) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Transação não encontrada" });
  }

  transactions[index] = { id: transactions[index].id, ...req.body };
  localStorage.setItem("key", JSON.stringify(transactions));
  return res.json(transactions[index]);
}

function remove(req: Request<RemoveTransactionParams>, res: Response) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const index = transactions.findIndex(
    (t: any) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Transação não encontrada" });
  }

  transactions.splice(index, 1);
  localStorage.setItem("key", JSON.stringify(transactions));
  return res.status(204).send();
}

const test = (req: Request<RemoveTransactionParams>, res: Response) => {
  const { title, value, transactionType, date } = req.body;
  if (!title || !value || transactionType === undefined || !date) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const nextId =
    transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1;

  const newTransaction = { id: nextId, title, value, transactionType, date };
  transactions.push(newTransaction);
  localStorage.setItem("key", JSON.stringify(transactions));

  return res.status(200)
};

export default {
  test,
  create,
  read,
  readOnlyOne,
  update,
  remove,
};
