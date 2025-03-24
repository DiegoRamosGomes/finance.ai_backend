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
    res.status(400).json({ message: "Todos os campos são obrigatórios" });
    return;
  }

  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const nextId =
    transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1;

  const newTransaction = { id: nextId, title, value, transactionType, date };
  transactions.push(newTransaction);
  localStorage.setItem("key", JSON.stringify(transactions));

  res.status(201).json(newTransaction);
  return;
}

function read(req: Request, res: Response) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  res.json(transactions);
  return;
}

function readOnlyOne(req: Request<RemoveTransactionParams>, res: Response) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const transaction = transactions.find(
    (t: any) => t.id === Number(req.params.id)
  );

  if (!transaction) {
    res.status(404).json({ message: "Transação não encontrada" });
    return;
  }
  res.json(transaction);
  return;
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
    res.status(404).json({ message: "Transação não encontrada" });
    return;
  }

  transactions[index] = { id: transactions[index].id, ...req.body };
  localStorage.setItem("key", JSON.stringify(transactions));
  res.json(transactions[index]);
  return;
}

function remove(req: Request<RemoveTransactionParams>, res: Response) {
  const transactions = JSON.parse(localStorage.getItem("key") || "[]");
  const index = transactions.findIndex(
    (t: any) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    res.status(404).json({ message: "Transação não encontrada" });
    return;
  }

  transactions.splice(index, 1);
  localStorage.setItem("key", JSON.stringify(transactions));
  res.status(204).send();
  return;
}

export default {
  create,
  read,
  readOnlyOne,
  update,
  remove,
};
