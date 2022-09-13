import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { GET, POST } from "../../../lib/constants/http.methods.constant";
import { connectToDatabase } from "../../../lib/mongodb";
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';
import { StudentRegistrationDTO } from "../../../dtos/StudentRegistrationDTO";
import { Helpers } from "../../../lib/helpers";
import { ObjectId } from "mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const { db } = await connectToDatabase();

    if (req.method === GET) {


        const students = await db.collection('users').find({ role: 'student' }).toArray();
        return res.json({
            message: "Students",
            status: 200,
            data: students
        });
    }

    /* CREATE STUDENT */
    if (req.method === POST) {

        const {
            email,
            name,
            role,
            password,
            registrationNumber,
            groupId,
        }: StudentRegistrationDTO = req.body;
        /*  TODO
        *   VALIDATE TO MAKE SURE EMAIL IS ACTUALLY AN EMAIL TYPE
        *   Consider using the joi library for validations
        */


        const registrationValidationSchema = yup.object().shape({
            role: yup.string().required(),
            email: yup.string().email().required(),
            name: yup.string().required(),
            groupId: yup.string().required(),
            password: yup.string().required(),
            registrationNumber: yup.string().required(),
        })

        return registrationValidationSchema.validate({
            name,
            email,
            role,
            groupId,
            registrationNumber,
            password
        })
            .then(async ({ email, name, role, registrationNumber, groupId, password }: StudentRegistrationDTO) => {

                const userCollection = db.collection('users');

                const emailExists = await userCollection.findOne({ email });

                if (emailExists) {
                    return res.status(400).send({
                        message: "Duplicate registraion",
                        error: "Email has already been taken",
                        status: 400,
                    });
                };

                if (!Helpers.isValidObjectId(groupId)) {
                    return res.status(400).send({
                        message: "Invalid Group",
                        error: "Group does not exist",
                        status: 400,
                    });
                }

                const group = await db.collection('groups').findOne({ _id: new ObjectId(groupId) });

                if (!group) {
                    return res.status(400).send({
                        message: "Invalid Group",
                        error: "Group does not exist",
                        status: 400,
                    });
                }

                const newUser = await userCollection.insertOne({
                    email,
                    name,
                    registrationNumber,
                    groupId,
                    role: role.toLowerCase(),
                    password: await bcrypt.hash(password, 10),

                })

                res.status(201).send({
                    message: "New Student Created",
                    data: await userCollection.findOne({ _id: newUser.insertedId }),
                    status: 201,
                })

            })
            .catch(error => {
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