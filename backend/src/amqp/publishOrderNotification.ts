import amqp from 'amqplib';
import dotenv from 'dotenv'
import { Status } from '../types/status';
dotenv.config()

interface Order {
  orderId: number, 
  userId: number, 
  email: string, 
  status: Status
}

export async function publishOrderNotification({ orderId, userId, email, status }: Order) {
  const connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  const exchange = 'orderNotifications';
  
  try {
    await channel.assertExchange(exchange, 'topic', {
      durable: true
    });

    const routingKey = `order.${status}`;
    const message = JSON.stringify({ orderId, userId, email, status });

    channel.publish(exchange, routingKey, Buffer.from(message), {
      persistent: true
    });

    console.log(" [x] Sent %s: '%s'", routingKey, message);
  } finally {
    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  }
}
