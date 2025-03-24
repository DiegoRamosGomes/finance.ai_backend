import { LocalStorage } from "node-localstorage";
import { Request, Response } from "express";
import { query } from "../services/database";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const localStorage = new LocalStorage("./scratch");

async function register(req: Request, res: Response) {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    res.status(400).json({ message: "Preencha todos os campos" });
    return;
  }

  const sql =
    "INSERT INTO users (name, email, password) VALUES($1, $2, $3) returning id, name, email";
  try {
    const users = await query(sql, [name, email, password]);
    res.status(201).json(users[0]);
    return;
  } catch (e) {
    res.status(400).json({ message: "Usuário já está cadastrado" });
    return;
  }
}

async function login(req: Request, res: Response) {
  const { password, email } = req.body;
  const sql = `SELECT id, name, email FROM users WHERE email = $1 AND password = $2;`;
  const users = await query(sql, [email, password]);

  if (users.length) {
    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET ?? "");
    const response = {
      token,
      user: users[0],
    };
    res.json(response);
    return;
  }
  res.status(404).json({ message: "Credenciais inválidas" });
  return;
}

async function getMe(req: AuthenticatedRequest, res: Response) {
  const sql = `SELECT id, name, email FROM users WHERE id = $1`;
  const users = await query(sql, [req.user?.toString() ?? '']);

  if (users.length) {
    res.json(users[0]);
    return;
  }

  return;
}

function updateMe(req: Request, res: Response) {}

export default {
  register,
  login,
  getMe,
  updateMe,
};
