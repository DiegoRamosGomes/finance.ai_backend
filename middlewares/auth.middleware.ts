import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload; // Ou outro tipo que represente o payload do JWT
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.split(" ")[1]; // Pega o token do header

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
      id: string;
    };
    req.user = decoded.id; // Adiciona o usuário decodificado ao request
    next();
  } catch (error) {
    res.status(403).send({ message: "Token inválido ou expirado." });
    return;
  }
}
