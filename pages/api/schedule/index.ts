import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { GET, POST } from "../../../lib/constants/http.methods.constant";
import { connectToDatabase } from "../../../lib/mongodb";
import * as yup from 'yup';
import { Helpers } from "../../../lib/helpers";
import { ObjectId } from "mongodb";
import { PENDING } from "../../../lib/constants/status.constant";
import MailUtility from "../../../lib/mail.helper";
import UserModel from "../../../models/User.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const { db } = await connectToDatabase();

    if (req.method === GET) {

        const schedules = await db.collection('schedules').find({}).toArray();
        return res.json({
            message: "Schedules",
            status: 200,
            data: schedules
        });
    }

    if (req.method === POST) {

        const authUser = Helpers.getRequestAuthData(req);
        const {
            availabilityId
        }: { availabilityId: string } = req.body;
        /*  TODO
        *   VALIDATE TO MAKE SURE EMAIL IS ACTUALLY AN EMAIL TYPE
        *   Consider using the joi library for validations
        */

        const registrationValidationSchema = yup.object().shape({
            availabilityId: yup.string().required(),
        })

        return registrationValidationSchema.validate({
            availabilityId
        })
            .then(async ({ availabilityId }) => {
                const scheduleCollection = db.collection('schedules');

                /* 
                *   VALIDATE TO MAKE SURE THE AVAILABILITY ID IS A VALID MONGO DB ID
                 */
                if (!Helpers.isValidObjectId(availabilityId)) {
                    return res.status(400).send({
                        message: "Invalid ID",
                        error: "The availability ID is not valid",
                        status: 400,
                    });
                }

                /* 
                *   VERIFY THAT THE AVAILABILITY EXISTS
                 */
                const availability = await db.collection('availabilities').findOne({ _id: new ObjectId(availabilityId) });

                if (!availability) {
                    return res.status(404).send({
                        message: "Not found",
                        error: "Availability does not exist or might have been removed",
                        status: 404,
                    });
                };

                /* 
                *   ONLY AVAILABILITIES THAT HAVE NOT BE ACCEPTED FOR A GROUP SCHEDULE SHOUDL BE 
                *   AVAILABLE FOR SCHEDULE REQUEST
                *   STUDENTS SHOULD NOT BE ABLE TO SCHEDULE AN AVAILABILITY THAT HAS ALREADY BEEN
                *   ACCEPTED, CANCELLED OR FULFILLED
                 */
                if (availability?.status !== PENDING) {
                    return res.status(400).send({
                        message: "unavailabile",
                        error: "This appointment time is not available for booking",
                        status: 400,
                    });
                }

                /* 
                *   THE LOGGED IN USER MUST BE A STUDENT TO BOOK A SCHEDULE 
                *   AND THE SCHEDULE SHOULD BE ASSIGNED TO THE GROUP WHICH THE LOGGED IN USER BELONGS TO
                *   
                 */
                const student = await db.collection('users').findOne({ _id: new ObjectId(authUser.id), });

                if (!student?.groupId) {
                    return res.status(403).send({
                        message: "Unauthorized",
                        error: "You must be registered as a student and assigned to a team to book a schedule",
                        status: 403,
                    });
                }

                /* 
                *   A GROUP SHOULD NOT BE ABLE TO SCHEDULE AN APPOINTMENT FOR THE SAME AVAILABILITY
                *   MORE THAN ONCE
                 */

                const scheduleExist = await scheduleCollection.findOne({ groupId: student.groupId, availabilityId })


                if (scheduleExist) {
                    return res.status(400).send({
                        message: "Duplicate",
                        error: "A team can only request to been an appointment for an availability once",
                        status: 400,
                    });
                }


                const newSchedule = await scheduleCollection.insertOne({
                    availabilityId,
                    availability,
                    instructorId: availability.instructorId,
                    groupId: student.groupId,
                    status: PENDING,

                });

                await MailUtility.sendEmail({
                    email: availability?.instructor?.email,
                    template: '../../../../email-templates/new-schedule.ejs',
                    data: {
                        password: "D#1sdkNe;930",
                        role: "Instructor",
                        name: "Chinedu Ukpe"
                    },
                    options: {
                        from: "Support",
                        subject: "New Schedule"
                    }
                });

                res.status(201).send({
                    message: "New Schedule Requested",
                    data: await scheduleCollection.findOne({ _id: newSchedule.insertedId }),
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