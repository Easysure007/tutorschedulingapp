import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { GET } from "../../../lib/constants/http.methods.constant";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    if (req.method === GET) {
        const { db } = await connectToDatabase();
        const cordinators = await db.collection('users').find({ role: 'cordinator' }).toArray();
        return res.json({
            message: "Cordinators",
            data: cordinators,
            status: 200
        });
    }
    return res.status(405).send({
        message: "METHOD NOT SUPPORTED",
        error: "METHOD NOT FOUND",
        status: 405
    });
}