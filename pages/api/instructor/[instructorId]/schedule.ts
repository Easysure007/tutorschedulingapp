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

        const group = await db.collection('schedules').find({ instructorId: new ObjectId(instructorId) }).toArray();

        if (!group) {
            return res.status(404).json({
                message: "Not Found",
                error: `No Schedules found for instructor with ID ${instructorId}`,
                status: 404
            });
        }

        return res.json({
            message: "Instructor Schedules",
            data: group,
            status: 200,
        })
    }
    return Helpers.unsupportedMethodException(res);
}