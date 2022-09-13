// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';
import AuthUserDTO from '../../../../dtos/AuthUser.dto';
import { SignJWT } from 'jose';
import { LoginDTO } from '../../../../dtos/Login.dto';
import { POST } from '../../../../lib/constants/http.methods.constant';
import * as yup from 'yup';
import { HTTPErrorDTO, HTTPSuccessDTO } from '../../../../dtos/HTTP.dto';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ServerConfig } from '../../../../lib/config';
import { ACTIVE } from '../../../../lib/constants/status.constant';
import UserModel from '../../../../models/User.model';
import { Helpers } from '../../../../lib/helpers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>
) {
    if (req.method === POST) {
        const { db } = await connectToDatabase();
        /**
         * EXTRACT THE USER'S EMAIL AND PASSWORD FROM THE REQUEST BODY
         */
        const {
            email,
            password
        }: LoginDTO = req.body;

        /**
         * CREATE THE SHAPE OF THE DATA REQUIRED.
         * WHAT THE USER SHOULD SEND AND IN WHAT FORMAT.
         */
        let loginValidationSchema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().min(8).required(),
        });


        /**
         * VALIDATE IF THE DATA PROVIDED MATCHES THE VALIDATION SCHEMA ABOVE
         */
        return loginValidationSchema.validate({ email, password })
            .then(async (validated) => {
                const userExists: UserModel = await db.collection('users').findOne({ email: validated.email });

                /**
                 * IF NO USER WITH THAT EMAIL EXIST OR THE PASSWORD PROVIDED DOES NOT MATCH
                 * THROW ERROR
                 */
                if (!userExists || !await bcrypt.compare(validated.password, userExists.password)) {
                    return res.send({
                        message: "Authentication failed",
                        error: "Invalid username or password",
                        status: 401,
                    })
                }

                /**
                 * PREVENT A USER THAT IS DISABLED FROM SIGNING IN
                 */
                if (userExists.status !== ACTIVE) {
                    return res.send({
                        message: "Authentication failed",
                        error: "Your account is not active",
                        status: 401,
                    })
                }

                const authUser: AuthUserDTO = {
                    id: userExists._id,
                    name: userExists.name,
                    email: userExists.email,
                    role: userExists.role,
                }

                // const accessToken: string = await jwt.sign(authUser, process.env.JWT_SECRET || "Somerandom string");
                const iat = Math.floor(Date.now() / 1000);
                const exp = iat + 60 * 60; // one hour
                const accessToken: string = await new SignJWT({ ...authUser })
                    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
                    .setExpirationTime(exp)
                    .setIssuedAt(iat)
                    .setNotBefore(iat)
                    .sign(new TextEncoder().encode(ServerConfig.getJWTSecret()));
                return res.send({
                    message: "Authentication Successful",
                    data: {
                        accessToken,
                        user: authUser
                    },
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
    return Helpers.unsupportedMethodException(res)
}
