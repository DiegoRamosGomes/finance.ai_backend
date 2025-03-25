import { Request, Response } from "express";
import { query } from "../services/database";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

type CreateAndUpdateTransactionBodyParams = {
  title: string;
  value: string;
  transactionType: number;
  date: string;
  userId: string;
};

type RemoveTransactionParams = {
  id: string;
};

async function create(
  req: AuthenticatedRequest<{}, {}, CreateAndUpdateTransactionBodyParams>,
  res: Response
) {
  const { title, value, transactionType, date } = req.body;
  if (!title || !value || !transactionType || !date) {
    res.status(400).json({ message: "Todos os campos são obrigatórios." });
    return;
  }

  const sql =
    "INSERT INTO transactions(title, value, transaction_type, date, user_id) VALUES($1, $2, $3, $4, $5)returning id, title, value, transaction_type, date, user_id";
  try {
    const transactions = await query(sql, [
      title,
      value,
      transactionType.toString(),
      date,
      req.user?.toString() ?? "",
    ]);
    res.status(201).json(transactions[0]);
    return;
  } catch (e) {
    res.status(400).json({ message: "Algo deu errado, tente novamente." });
  }
}

async function read(req: AuthenticatedRequest, res: Response) {
  const sql = "SELECT * FROM transactions WHERE user_id = $1";
  const transactions = await query(sql, [req.user?.toString() ?? ""]);
  res.status(200).json(transactions);
  return;
}

async function readOnlyOne(
  req: AuthenticatedRequest<RemoveTransactionParams>,
  res: Response
) {
  const sql = "SELECT * FROM transactions WHERE user_id = $1";
  const transactions = await query(sql, [req.user?.toString() ?? ""]);
  const transaction = transactions.find(
    (t: any) => t.id === Number(req.params.id)
  );

  if (!transaction) {
    res.status(404).json({ message: "Transação não encontrada." });
    return;
  }
  res.json(transaction);
  return;
}

async function update(
  req: AuthenticatedRequest<
    RemoveTransactionParams,
    {},
    CreateAndUpdateTransactionBodyParams
  >,
  res: Response
) {
  const { title, value, transactionType, date } = req.body;
  const sql = "UPDATE transactions SET title = $1, value = $2, transaction_type = $3, date = $4 WHERE id = $5 AND user_id = $6 returning id, title, value, transaction_type, date, user_id";
  const transactions = await query(sql, [title, value, transactionType.toString(), date, req.params.id, req.user?.toString() ?? ""]);
  const index = transactions.findIndex(
    (t: any) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    res.status(404).json({ message: "Transação não encontrada." });
    return;
  }

  transactions[index] = { id: transactions[index].id, ...req.body };
  res.json(transactions[index]);
  return;
}

async function remove(req: AuthenticatedRequest<RemoveTransactionParams>, res: Response) {
  const sql  = "DELETE FROM transactions WHERE id = $1 AND user_id = $2"
  await query(sql, [req.params.id, req.user?.toString() ?? ""]);
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
