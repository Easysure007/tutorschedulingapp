// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import AuthUserDTO from '../../../../dtos/AuthUser.dto';
import { SignJWT } from 'jose';
import { POST } from '../../../../lib/constants/http.methods.constant';
import * as yup from 'yup';
import * as bcrypt from 'bcrypt';
import { HTTPErrorDTO, HTTPSuccessDTO } from '../../../../dtos/HTTP.dto';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ServerConfig } from '../../../../lib/config';
import { Helpers } from '../../../../lib/helpers';
import UserModel from '../../../../models/User.model';
import StudentModel from '../../../../models/student.model';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>
) {
    if (req.method === POST) {
        const { db } = await connectToDatabase();
        // const studentId: string = req.body.studentId?.toString();
        const {
            studentId,
            password,
            groupName
        } = req.body;

        let studentValidationSchema = yup.object().shape({
            studentId: yup.string().required(),
            password: yup.string().min(8).required(),
            groupName: yup.string().required(),
        });

        return studentValidationSchema.validate({ studentId, password, groupName })
            .then(async (validated) => {
                const { studentId } = validated;
                const userExists: StudentModel = await db.collection('users').findOne({ registrationNumber: studentId });

                if (!userExists || !await bcrypt.compare(password, userExists.password)) {
                    return res.status(401).send({
                        message: "Authentication failed",
                        error: "Invalid student ID  or password provided",
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
                        student: {
                            id: userExists._id,
                            name: userExists.name,
                            registrationNumber: userExists.registrationNumber,
                            role: userExists.role,
                            groupId: userExists.groupId,

                        }
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
    return Helpers.unsupportedMethodException(res);
}
