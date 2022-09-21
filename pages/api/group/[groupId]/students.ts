import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../../dtos/HTTP.dto";
import { GET } from "../../../../lib/constants/http.methods.constant";
import { Helpers } from "../../../../lib/helpers";
import { connectToDatabase } from "../../../../lib/mongodb";
import UserModel from "../../../../models/User.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const groupId: string = req.query.groupId?.toString() || '';
    const { db } = await connectToDatabase();
    if (req.method === GET) {
        if (!Helpers.isValidObjectId(groupId)) {
            return res.json({
                message: "Invalid Group ID",
                status: 200,
                data: [],
            })
        }
        const students: Array<UserModel> = await db.collection('users').find({ groupId }).toArray()
        return res.json({
            message: "Students",
            status: 200,
            data: students,
        })
    }
    return Helpers.unsupportedMethodException(res);
}