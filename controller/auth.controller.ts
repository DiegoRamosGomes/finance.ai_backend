import { LocalStorage } from "node-localstorage";
import { Request, Response } from "express";

const localStorage = new LocalStorage("./scratch");

function register(req: Request, res: Response) {
  const { name, password, email } = req.body;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { id: nextId, name, password, email };

  if (!name || !password || !email) {
    res.status(400).json({ message: "Preencha todos os campos" });
    return;
  }

  const user = users.findIndex((item) => item.email === email);
  if (user > -1) {
    res.status(409).json({ message: "Email já cadastrado" });
    return;
  }

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  delete newUser.password;
  res.status(201).json(newUser);
  return;
}

function login(req: Request, res: Response) {
  const { password, email } = req.body;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (item) => item.email === email && item.password === password
  );

  if (user) {
    delete user.password;
    res.json(user);
    return;
  }
  res.status(404).json({ message: "Credenciais inválidas" });
  return;
}

function getMe(req: Request, res: Response) {}

function updateMe(req: Request, res: Response) {}

export default {
  register,
  login,
  getMe,
  updateMe,
};
