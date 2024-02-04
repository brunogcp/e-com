import amqp from 'amqplib';
import dotenv from 'dotenv';
import { sendOrderNotificationEmail } from 'src/queue/sendOrderNotificationEmail';
dotenv.config();

export async function startOrderNotificationWorker() {
  const connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  const exchange = 'orderNotifications';
  const queueName = 'orderNotificationsQueue'; // Nome da fila durável

  await channel.assertExchange(exchange, 'topic', {
    durable: true // Torna o exchange durável
  });

  // Cria uma fila durável
  const queue = await channel.assertQueue(queueName, {
    durable: true // Torna a fila durável
  });

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue);

  // Bind para todas as chaves de roteamento relacionadas a pedidos
  channel.bindQueue(queue.queue, exchange, 'order.*');

  channel.consume(queue.queue, async (msg) => {
    if (msg?.content) {
      const notificationData = JSON.parse(msg.content.toString());
      console.log(" [x] Received %s", notificationData);

      const email = notificationData.email
      const status = notificationData.status
      const products = notificationData.products
      await sendOrderNotificationEmail(email, status, products)
    }
  }, {
    noAck: true
  });
}


startOrderNotificationWorker()