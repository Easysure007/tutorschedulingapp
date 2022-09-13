import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../../dtos/HTTP.dto";
import { GET, PATCH } from "../../../../lib/constants/http.methods.constant";
import { Helpers } from "../../../../lib/helpers";
import { connectToDatabase } from "../../../../lib/mongodb";
import * as bcrypt from 'bcrypt';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const instructorId: string = req.query.instructorId?.toString() || '';
    const { db } = await connectToDatabase();
    if (req.method === GET) {

        if (!Helpers.isValidObjectId(instructorId)) {
            return res.status(404).json({
                message: "Not Found",
                error: `Instructor with ID ${instructorId} does not exist`,
                status: 404
            });
        }

        const group = await db.collection('users').findOne({ _id: new ObjectId(instructorId), role: "instructor" });

        if (!group) {
            return res.status(404).json({
                message: "Not Found",
                error: `Instructor with ID ${instructorId} does not exist`,
                status: 404
            });
        }

        return res.json({
            message: "Single Instructor",
            data: group,
            status: 200,
        })
    }

    if (req.method === PATCH) {

        const {
            email,
            name,
            password,
            role,
            status,
            registrationNumber,
            groupId,
            isAnonymous,
        } = req.body;

        if (!Helpers.isValidObjectId(instructorId)) {
            return res.status(404).json({
                message: "Not Found",
                error: `User with ID ${instructorId} does not exist`,
                status: 404
            });
        }


        let user = await db.collection('users').findOne({ _id: new ObjectId(instructorId) });

        if (!user) {
            return res.status(404).json({
                message: "Not Found",
                error: `User with ID ${instructorId} does not exist`,
                status: 404
            });
        }

        await db.collection('users').update({ _id: new ObjectId(instructorId) }, {
            $set: {
                email: email ?? user.email,
                name: name ?? user.name,
                role: role ?? user.role,
                status: status ?? user.status,
                registrationNumber: registrationNumber ?? user.registrationNumber,
                groupId: groupId ?? user.groupId,
                password: password ? await bcrypt.hash(password, 10) : user.password,
                isAnonymous: isAnonymous ?? user.isAnonymous,
            }
        });
        user = await db.collection('users').findOne({ _id: new ObjectId(instructorId) });

        return res.json({
            message: "User Updated",
            data: user,
            status: 200,
        })
    }
    return Helpers.unsupportedMethodException(res);
}