import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const emailQueue = new Queue('emailQueue', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
});

export default emailQueue;
