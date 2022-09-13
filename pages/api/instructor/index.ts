import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { GET } from "../../../lib/constants/http.methods.constant";
import { Helpers } from "../../../lib/helpers";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    if (req.method === GET) {
        const { db } = await connectToDatabase();
        const instructors = await db.collection('users').find({ role: 'instructor' }).toArray();
        return res.json({
            message: "Instructors",
            data: instructors,
            status: 200
        });
    }
    return Helpers.unsupportedMethodException(res);
}