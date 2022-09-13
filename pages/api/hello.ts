// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../lib/db'
import MailUtility from '../../lib/mail.helper';
import { connectToDatabase } from '../../lib/mongodb';
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await MailUtility.sendEmail({
    email: 'geefive3@gmail.com',
    template: '../../../../email-templates/test.ejs',
    data: {
      password: "D#1sdkNe;930",
      role: "Instructor",
      name: "Chinedu Ukpe"
    },
    options: {
      from: "Support",
      subject: "Welcome"
    }
  });
  return res.send({ name: "Hello" })
}
