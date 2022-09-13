// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';
import { RegistrationDTO } from '../../../dtos/Registeration.dto';
import { POST } from '../../../lib/constants/http.methods.constant';
import * as yup from 'yup';
import { HTTPErrorDTO, HTTPSuccessDTO } from '../../../dtos/HTTP.dto';
import { connectToDatabase } from '../../../lib/mongodb';
import { Helpers } from '../../../lib/helpers';
import { ACTIVE } from '../../../lib/constants/status.constant';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>
) {
  if (req.method === POST) {
    const { db } = await connectToDatabase();

    const authUser = Helpers.getRequestAuthData(req);
    if (authUser.role !== 'cordinator') {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized",
        error: "You are not authorized to create users.",
      })
    }

    const {
      password,
      email,
      passwordConfirmation,
      name,
      role,
      isAnonymous,
    }: RegistrationDTO = req.body;
    /*  TODO
    *   VALIDATE TO MAKE SURE EMAIL IS ACTUALLY AN EMAIL TYPE
    *   Consider using the joi library for validations
    */


    const registrationValidationSchema = yup.object().shape({
      password: yup.string().required().min(8),
      passwordConfirmation: yup.string().required().equals([password], "Password and password confirmation do not match"),
      role: yup.string().required(),
      email: yup.string().email().required(),
      name: yup.string().required(),
      isAnonymous: yup.boolean().default(true),
      registrationNumber: yup.string(),
    });

    return registrationValidationSchema.validate({
      name,
      email,
      role,
      password,
      passwordConfirmation,
      isAnonymous,
    })
      .then(async ({ email, password, name, role }: RegistrationDTO) => {

        const userCollection = db.collection('users');

        const emailExists = await userCollection.findOne({ email });

        if (emailExists) {
          return res.status(400).send({
            message: "Duplicate registraion",
            error: "Email has already been taken",
            status: 400,
          })
        };

        const newUser = await userCollection.insertOne({
          email,
          name,
          role: role.toLowerCase(),
          password: await bcrypt.hash(password, 10),
          isAnonymous,
          status: ACTIVE,
        })

        res.status(201).send({
          message: "New User Created",
          data: await userCollection.findOne({ _id: newUser.insertedId }),
          status: 201,
        })

      })
      .catch(error => {
        return res.status(400).send({
          message: "Validation failed",
          error: error.errors[0],
          status: 400,
        })
      });

  }
}
