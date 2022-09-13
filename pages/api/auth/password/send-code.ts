// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// import * as bcrypt from 'bcrypt';
import { POST } from '../../../../lib/constants/http.methods.constant';
import * as yup from 'yup';
import { HTTPErrorDTO, HTTPSuccessDTO } from '../../../../dtos/HTTP.dto';
import { connectToDatabase } from '../../../../lib/mongodb';
// import { Helpers } from '../../../../lib/helpers';
// import { ACTIVE } from '../../../../lib/constants/status.constant';
import { DateTime } from 'luxon';
import MailUtility from '../../../../lib/mail.helper';
import { Helpers } from '../../../../lib/helpers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>
) {
    if (req.method === POST) {
        const { db } = await connectToDatabase();
        const {
            email,
        }: { email: string } = req.body;

        const passwordResetValidationSchema = yup.object().shape({
            email: yup.string().email().required(),
        });

        return passwordResetValidationSchema.validate({
            email,
        })
            .then(async ({ email }: { email: string }) => {

                const userCollection = db.collection('users');
                const passwordResetCodeCollection = db.collection('passwordResetCodes')

                const user = await userCollection.findOne({ email });

                if (!user) {
                    return res.status(404).send({
                        message: "Not Found",
                        error: `User with email ${email} not found`,
                        status: 404,
                    })
                }

                /**
                 * INVALIDATE ANY OTHER CODE PREVIOUSLY SENT TO THE USER
                 */

                passwordResetCodeCollection.updateMany({ email }, {
                    $set: {
                        isValid: false,
                    }
                });

                const code: number = 100000 + Math.floor(Math.random() * 800000);

                /**
                 * THE CODE SHOULD EXPIRE AFTER ONE HOUR.
                 * PROBABLY SEND A NEW CODE WHEN THE CODE IS USED.
                 */
                passwordResetCodeCollection.insertOne({
                    email,
                    code,
                    isValid: true,
                    expires: DateTime.now().plus({ hour: 1 })
                });

                await MailUtility.sendEmail({
                    email,
                    template: '/../../../../../../email-templates/password-reset-code.ejs',
                    data: {
                        code,
                        user,
                    },
                    options: {
                        subject: "Password Reset"
                    }
                })

                res.status(201).send({
                    message: "Password reset code sent",
                    data: null,
                    status: 201,
                })

            })
            .catch(error => {
                console.log(error)
                return res.status(400).send({
                    message: "Validation failed",
                    error: error.errors ? error.errors[0] : "Internal server error occured",
                    status: error.errors ? 400 : 500,
                })
            });

    }

    return Helpers.unsupportedMethodException(res);
}
