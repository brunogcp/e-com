import fs from 'fs'
import path from 'path';
import handlebars from 'handlebars';

import { Status } from 'src/types/status';
import emailQueue from './emailQueue';
import { ProductAttributes } from 'src/models/Product';

export async function sendOrderNotificationEmail(email: string, status: Status, products: ProductAttributes[]) {
  let subject
  let statusDescription
  let description

  switch (status) {
    case 'confirmed':
      subject = 'Pedido Confirmado'
      statusDescription = 'Seu pedido foi confirmado!'
      description = 'Estamos felizes em informar que seu pedido foi confirmado e está sendo preparado para envio.'
      break;
    case 'delivered':
      subject = 'Pedido Entregue'
      statusDescription = 'Seu pedido foi entregue.'
      description = 'Estamos felizes em informar que seu pedido foi entregue. Esperamos que você esteja satisfeito com sua compra!'
      break;
    case 'canceled':
      subject = 'Pedido Cancelado'
      statusDescription = 'Seu pedido foi cancelado.'
      description = 'Lamentamos informar que seu pedido foi cancelado. Para mais informações, entre em contato com nosso suporte ao cliente.'
      break;
    case 'sent':
      subject = 'Pedido Enviado'
      statusDescription = 'Seu pedido foi enviado</span>!'
      description = 'Boas notícias! Seu pedido está a caminho. Você pode rastrear o envio usando o código de rastreamento fornecido.'
      break;
    default:
      subject = 'Pedido Pendente'
      statusDescription = 'Seu pedido está pendente.'
      description = 'Agradecemos pela sua compra. Seu pedido está sendo processado e em breve você receberá uma atualização sobre o status do pedido.'
      break;
  }

  const filePath = path.join(__dirname, '../templates/order-notification.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  
  handlebars.registerHelper('total', function (price, quantity) {
    return price * quantity
  })

  const template = handlebars.compile(source);
  const replacements = {
    tittle: subject,
    status: statusDescription,
    description,
    products,
    HOST_URL: process.env.HOST_URL
  };
  const htmlToSend = template(replacements);

  await emailQueue.add('sendEmail', {
    to: email,
    subject,
    html : htmlToSend
  });
} 
