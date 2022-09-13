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
    const scheduleId: string = req.query.scheduleId?.toString() || '';
    const { db } = await connectToDatabase();
    const scheduleCollection = db.collection('schedules');
    if (req.method === GET) {
        try {
            let schedule;
            if (!Helpers.isValidObjectId(scheduleId)) {
                return res.status(400).send({
                    message: `Bad Request`,
                    status: 400,
                    error: `Invalid Schedule ID provided`,
                })
            }

            schedule = await scheduleCollection.findOne({ _id: new ObjectId(scheduleId) });

            if (!schedule) {
                return res.status(404).send({
                    message: `Not Found`,
                    status: 404,
                    error: `schedule with ID: ${scheduleId} was not found`,
                })
            }

            return res.send({
                message: `schedule with ID: ${scheduleId}`,
                status: 200,
                data: schedule,
            })
        } catch (error) {
            console.log(error)
            return res.status(404).send({
                message: `Not Found`,
                status: 404,
                error: `schedule with ID: ${scheduleId} was not found`,
            })
        }


    }
    return res.status(405).send({
        message: "METHOD NOT SUPPORTED",
        error: "METHOD NOT FOUND",
        status: 405
    })
}