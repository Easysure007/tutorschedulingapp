// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';
import { RegistrationDTO } from '../../../../dtos/Registeration.dto';
import { POST } from '../../../../lib/constants/http.methods.constant';
import * as yup from 'yup';
import { HTTPErrorDTO, HTTPSuccessDTO } from '../../../../dtos/HTTP.dto';
import { connectToDatabase } from '../../../../lib/mongodb';
import { Helpers } from '../../../../lib/helpers';
import { ACTIVE } from '../../../../lib/constants/status.constant';
import { PasswordResetDTO } from '../../../../dtos/PasswordReset.dto';
import PasswordResetModel from '../../../../models/PasswordReset.model';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>
) {
    if (req.method === POST) {
        const { db } = await connectToDatabase();

        const {
            password,
            email,
            passwordConfirmation,
            code,
        }: PasswordResetDTO = req.body;
        /*  TODO
        *   VALIDATE TO MAKE SURE EMAIL IS ACTUALLY AN EMAIL TYPE
        *   Consider using the joi library for validations
        */


        const registrationValidationSchema = yup.object().shape({
            password: yup.string().required().min(8),
            passwordConfirmation: yup.string().required().equals([password], "Password and password confirmation do not match"),
            email: yup.string().email().required(),
            code: yup.number().required(),
        });

        return registrationValidationSchema.validate({
            code,
            email,
            password,
            passwordConfirmation,
        })
            .then(async ({ email, password, code }: PasswordResetDTO) => {

                const userCollection = db.collection('users');

                const user = await userCollection.findOne({ email });

                const passwordResetCodeCollection = db.collection('passwordResetCodes')

                /**
                 * You cannot change password for a user that is not registered
                 */
                if (!user) {
                    return res.status(404).send({
                        message: "Not Found",
                        error: "No user with that email found",
                        status: 404,
                    })
                };

                /**
                 * The code the user is reseting with must not have been used and must exist.
                 */
                const codeRecord: PasswordResetModel = await passwordResetCodeCollection.findOne({ code, email, isValid: true })

                if (!codeRecord) {
                    return res.status(400).send({
                        message: "Invalid Code",
                        error: "The code provided is invalid or have been used",
                        status: 400,
                    })
                }

                /**
                 * INVALIDATE ALL CODES SENT TO THE USER.
                 * THIS WILL MAKE THE USER REQUEST FOR A NEW CODE WHEN
                 * THEY NEED TO RESET THEIR PASSWORD AGAIN
                 */
                passwordResetCodeCollection.updateMany({ email }, {
                    $set: {
                        isValid: false,
                    }
                });

                /**
                 * UPDATE THE USER PASSWORD
                 */
                userCollection.updateOne({ email }, {
                    $set: {
                        password: await bcrypt.hash(password, 10)
                    }
                });

                res.status(200).send({
                    message: "Password reset successful",
                    data: null,
                    status: 200,
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

    return Helpers.unsupportedMethodException(res);
}
