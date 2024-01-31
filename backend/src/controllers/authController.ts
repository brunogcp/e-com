import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    if (!email) {
      return res.status(400).json({ message: 'E-mail é obrigatório' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Senha é obrigatório' });
    }

    // Verifica se o email já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    }, { raw: true });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso.',
      userId: user.id
    });
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Erro ao registrar usuário.', error: error instanceof Error ? error.message : '' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'E-mail é obrigatório' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Senha é obrigatório' });
    }

    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Geração do token JWT
    const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, process.env.JWT_SECRET!, {
      expiresIn: '1d', // validade do token
    });

    req.session.userId = user.id

    return res.json({
      message: 'Login bem-sucedido.',
      token,
    });
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Erro no servidor ao tentar login.', error: error instanceof Error ? error.message : '' });
  }
};