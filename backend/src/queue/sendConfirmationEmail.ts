import emailQueue from './emailQueue';

export async function sendConfirmationEmail(email: string) {
  await emailQueue.add('sendEmail', {
    to: email,
    subject: 'Confirmação de E-mail',
    text: 'Obrigado por se registrar!',
  });
}

import path from 'path'
