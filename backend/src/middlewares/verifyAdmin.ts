import { Request, Response, NextFunction } from 'express';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.user?.admin) {
    return next()
  }
  res.status(401).json({ message: 'Usuário deve ser administrador.' });
};
