import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../server';

export const redisCache = (cacheKey: string, ttl: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData != null) {
        console.log(`Serving from cache: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      } else {
        // Guarda a referência original do método send
        const originalSend = res.send;
        
        // Substitui temporariamente o método send para capturar a resposta
        res.send = (body) => {
          // Armazena a resposta no cache
          redisClient.set(cacheKey, body, { EX: ttl })
            .then(() => console.log(`Caching response: ${cacheKey}`))
            .catch((cacheError) => console.error('Redis set error:', cacheError));
          
          // Restaura o método send original e envia a resposta ao cliente
          res.send = originalSend; // Restaura o send original
          return originalSend.call(res, body);
        };
        
        return next();
      }
    } catch (error) {
      console.error('Redis get error:', error);
      return next(); // Continua com a requisição em caso de erro no Redis
    }
  };
};

export const invalidateRedisCache = (cacheKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await redisClient.del(cacheKey)
      } catch (error) {
      console.error('Redis get error:', error)
    } finally {
      return next();
    }
  };
};