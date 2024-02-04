import express, {Express, Request, Response} from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import dotenv from 'dotenv';
import {createClient} from 'redis';
import path from 'path';
import cors from 'cors'

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import helmet from 'helmet';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Crie um cliente Redis. Adapte as opções conforme necessário.
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);
redisClient.on('error', err => console.log(err));

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'e-com:',
});

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: true,
    secret: process.env.REDIS_SECRET || 'password',
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true em produção
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // Expira em 24 horas
    },
  })
);

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://bgcp.com.com.br', 'https://api.bgcp.com.br'] : ['http://localhost:4173', 'http://localhost:5173', 'http://127.0.0.1:4173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Accept', 'Content-Type', 'Origin', 'authorization ']
}));
app.use(helmet());

// Servir arquivos estaticamente da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({message: 'E-COM'});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
