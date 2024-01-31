import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: 'Token de acesso requerido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email:string, admin: boolean };
    // Verifica se o ID do usuário no token corresponde ao ID do usuário na sessão
    if (req.session.userId && req.session.userId === parseInt(decoded.id)) {
      req.user = decoded; // Armazena informações do usuário no objeto de requisição para uso posterior
      return next();
    } else {
      // Se não houver sessão correspondente ou se o ID não coincidir, rejeita a autenticação
      return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
