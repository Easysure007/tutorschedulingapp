import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../../dtos/HTTP.dto";
import { GET, PATCH } from "../../../../lib/constants/http.methods.constant";
import { ACTIVE, PENDING } from "../../../../lib/constants/status.constant";
import { Helpers } from "../../../../lib/helpers";
import { connectToDatabase } from "../../../../lib/mongodb";
import { AvailabilityModel } from "../../../../models/Availability.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const availabilityId: string = req.query.availabilityId?.toString() || '';
    const { db } = await connectToDatabase();
    const availabilityCollection = db.collection('availabilities');
    if (req.method === GET) {
        try {
            let availability;
            if (!Helpers.isValidObjectId(availabilityId)) {
                return res.status(400).send({
                    message: `Bad Request`,
                    status: 400,
                    error: `Invalid availability ID provided`,
                })
            }

            availability = await availabilityCollection.findOne({ _id: new ObjectId(availabilityId) });

            if (!availability) {
                return res.status(404).send({
                    message: `Not Found`,
                    status: 404,
                    error: `Availability with ID: ${availabilityId} was not found`,
                })
            }

            return res.send({
                message: `Availability with ID: ${availabilityId}`,
                status: 200,
                data: availability,
            })
        } catch (error) {
            console.log(error)
            return res.status(404).send({
                message: `Not Found`,
                status: 404,
                error: `Availability with ID: ${availabilityId} was not found`,
            })
        }


    }

    if (req.method === PATCH) {
        if (!Helpers.isValidObjectId(availabilityId)) {
            return res.status(400).send({
                message: `Bad Request`,
                status: 400,
                error: `Invalid availability ID provided`,
            })
        }
        // availabilityCollection.updateMany({}, { $set: { status: PENDING } })
        const availabilityData: AvailabilityModel = await availabilityCollection.findOne({ _id: new ObjectId(availabilityId) });

        if (!availabilityData) {
            return res.status(404).json({
                message: "Not Found",
                error: `Availability with ID ${availabilityId} does not exist`,
                status: 404
            });
        }

        const { availabilityDate, endDate, duration, status } = req.body;

        await availabilityCollection.updateMany({ _id: new ObjectId(availabilityId) }, {
            $set: {
                availabilityDate: availabilityDate ?? availabilityData.availabilityDate,
                status: status ?? availabilityData.status,
                endDate: endDate ?? availabilityData.endDate,
                duration: duration ?? availabilityData.duration,
            }
        });

        return res.json({
            message: "Availability Updated",
            data: await await availabilityCollection.findOne({ _id: new ObjectId(availabilityId) }),
            status: 200
        })
    }

    return res.status(405).send({
        message: "METHOD NOT SUPPORTED",
        error: "METHOD NOT FOUND",
        status: 405
    })
}