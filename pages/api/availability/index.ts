import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { GET, POST } from "../../../lib/constants/http.methods.constant";
import { connectToDatabase } from "../../../lib/mongodb";
import * as yup from 'yup';
import { Helpers } from "../../../lib/helpers";
import { ObjectId } from "mongodb";
import { CreateAvailabilityDTO } from "../../../dtos/CreateAvailability.dto";
import { DateTime } from 'luxon'
import { PENDING } from "../../../lib/constants/status.constant";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const { db } = await connectToDatabase();

    if (req.method === GET) {


        const availabilities = await db.collection('availabilities').find({}).toArray();
        return res.json({
            message: "Availabilities",
            status: 200,
            data: availabilities
        });
    }

    /* CREATE AVAILABILITY */
    if (req.method === POST) {
        const authUser = Helpers.getRequestAuthData(req);
        const {
            availabilityDate,
            availabilityTime,
            duration,
        }: CreateAvailabilityDTO = req.body;


        const availabilityValidationSchema = yup.object().shape({
            availabilityDate: yup.string().required(),
            availabilityTime: yup.string().required(),
            duration: yup.number().required(),
        })

        return availabilityValidationSchema.validate({
            availabilityDate,
            availabilityTime,
            duration,
        })
            .then(async ({ availabilityDate, availabilityTime, duration, }: CreateAvailabilityDTO) => {

                const availabilityCollection = db.collection('availabilities');

                /* FIND THE CLOSEST TIME TO THAT AND MAKE SURE IT DOESN'T OVERLAP */
                const beforeTimeSpace = DateTime.fromISO(availabilityDate).minus({ minutes: duration }).toISO();
                const afterTimeSpace = DateTime.fromISO(availabilityDate).plus({ minutes: duration }).toISO();
                console.log(DateTime.fromISO(availabilityDate).toFormat('h:mm'))

                const availabilityExist = await availabilityCollection.find({
                    $or: [
                        { availabilityDate: { $gte: availabilityDate, $lt: afterTimeSpace } },
                        { endDate: { $gte: availabilityDate, $lt: afterTimeSpace } }
                    ]
                }).toArray();

                if (availabilityExist.length) {
                    return res.status(400).send({
                        message: "Duplicate Entry",
                        error: "You have an overlaping availability. Please check your availability.",
                        status: 400,
                    });
                };

                /* EXTRACT  INSTRUCTOR DETAIL FROM AUTH DATA
                *   PROBABLY RUN QUERY TO PULL THE INSTRUCTOR
                */
                const { exp, iat, nbf, ...instructor } = authUser;


                const newAvailability = await availabilityCollection.insertOne({
                    availabilityDate,
                    endDate: afterTimeSpace,
                    duration,
                    instructorId: new ObjectId(authUser.id),
                    status: PENDING,
                    instructor,
                })

                res.status(201).send({
                    message: "New Availability Created",
                    data: await availabilityCollection.findOne({ _id: newAvailability.insertedId }),
                    status: 201,
                })

            })
            .catch(error => {
                console.log(error)
                return res.status(400).send({
                    message: "Validation failed",
                    error: error.errors[0],
                    status: 400,
                })
            });
    }

    return res.status(405).send({
        message: "METHOD NOT SUPPORTED",
        error: "METHOD NOT FOUND",
        status: 405
    })
}