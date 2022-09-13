// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { GET, PATCH } from '../../../lib/constants/http.methods.constant';
import { HTTPErrorDTO, HTTPSuccessDTO } from '../../../dtos/HTTP.dto';
import { connectToDatabase } from '../../../lib/mongodb';
import { Helpers } from '../../../lib/helpers';
import UserModel from '../../../models/User.model';
import * as yup from 'yup';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import AuthUserDTO from '../../../dtos/AuthUser.dto';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>
) {
    if (req.method === GET) {
        const { db } = await connectToDatabase();

        const authUser: AuthUserDTO = Helpers.getRequestAuthData(req);

        /* PROBABLY QUERY THE DATABASE TO GET MORE INFORMATION IF NEEDED */

        return res.send({
            message: "User Profile",
            status: 200,
            data: {
                id: authUser.id,
                email: authUser.email,
                name: authUser.name,
                role: authUser.role,
            }
        })

    }
    if (req.method === PATCH) {
        const { db } = await connectToDatabase();

        const authUser: AuthUserDTO = Helpers.getRequestAuthData(req);

        const {
            email,
            name,
            password,
            isAnonymous,
        } = req.body;

        const updateProfileValidation = yup.object().shape({
            role: yup.string(),
            email: yup.string(),
            name: yup.string(),
            registrationNumber: yup.string(),
        });

        let user: UserModel = await db.collection('users').findOne({ _id: new ObjectId(authUser.id) });
        if (!user) {
            return res.status(404).json({
                message: "NOT Found",
                error: "User not found",
                status: 404
            })
        }

        db.collection('users').update({ _id: new ObjectId(authUser.id) }, {
            $set: {
                email: email ?? user.email,
                password: password ? await bcrypt.hash(password, 10) : user.password,
                name: name ?? user.name,
                isAnonymous: isAnonymous ?? user.isAnonymous,
            }
        })


        user = await db.collection('users').findOne({ _id: new ObjectId(authUser.id) });

        /* PROBABLY QUERY THE DATABASE TO GET MORE INFORMATION IF NEEDED */

        return res.send({
            message: "User Profile",
            status: 200,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        })

    }
}
