import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../../dtos/HTTP.dto";
import { GET } from "../../../../lib/constants/http.methods.constant";
import { Helpers } from "../../../../lib/helpers";
import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const groupId: string = req.query.groupId?.toString() || '';
    const { db } = await connectToDatabase();
    if (req.method === GET) {

        if (!Helpers.isValidObjectId(groupId)) {
            return res.status(404).json({
                message: "Not Found",
                error: `Group with ID ${groupId} does not exist`,
                status: 404
            });
        }

        const group = await db.collection('groups').findOne({ _id: new ObjectId(groupId) });

        if (!group) {
            return res.status(404).json({
                message: "Not Found",
                error: `Group with ID ${groupId} does not exist`,
                status: 404
            });
        }

        return res.json({
            message: "Single group",
            data: group,
            status: 200,
        })
    }
    return Helpers.unsupportedMethodException(res);
}