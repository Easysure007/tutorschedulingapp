import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../../dtos/HTTP.dto";
import { POST } from "../../../../lib/constants/http.methods.constant";
import { ACCEPTED, PENDING } from "../../../../lib/constants/status.constant";
import { Helpers } from "../../../../lib/helpers";
import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const scheduleId: string = req.query.scheduleId?.toString() || '';
    const { db } = await connectToDatabase();
    const scheduleCollection = db.collection('schedules');
    if (req.method === POST) {
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

            /* 
            *   UPDATE THE AVAILABILITY FOR THAT SCHEDULE TO BOOKED
            *   THIS WILL PREVENT ACCEPTING MULTIPLE SCHEDULE FOR SAME TIME
             */
            let availability = await db.collection('availabilities').findOne({ _id: new ObjectId(schedule.availabilityId) });

            if (availability?.status !== PENDING) {
                return res.status(400).send({
                    message: `Possible duplicate`,
                    status: 400,
                    error: `schedule is not available. This schedule might have been accepted for a different group`,
                })
            }

            await db.collection('availabilities').update({ _id: new ObjectId(schedule.availabilityId) }, {
                $set: {
                    status: ACCEPTED,
                }
            });

            await scheduleCollection.update({ _id: new ObjectId(scheduleId) }, {
                $set: {
                    status: ACCEPTED
                }
            });

            schedule = await scheduleCollection.findOne({ _id: new ObjectId(scheduleId) });

            /* TODO
            *   SEND EMAIL TO STUDENT AND INSTRUCTOR
             */

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