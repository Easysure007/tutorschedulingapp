import { NextApiRequest, NextApiResponse } from "next";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { GET, POST } from "../../../lib/constants/http.methods.constant";
import * as yup from 'yup';
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const { groupId } = req.query;
    const { db } = await connectToDatabase();
    if (req.method === GET) {
        try {
            const groups = await db.collection('groups').find({}).toArray();
            return res.json({
                message: "All Groups",
                data: groups,
                status: 200,
            })

        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: "Internal Server error",
                status: 500,
            })
        }
    }


    /* CREATE A NEW GROUP */
    if (req.method === POST) {
        const createValidateSchema = yup.object().shape({
            group: yup.string().required()
        });

        const { group } = req.body;

        return createValidateSchema.validate({ group })
            .then(async ({ group }) => {
                const groupExists = await db.collection('groups').findOne({ group });
                if (groupExists) {
                    return res.status(400).json({
                        message: "Duplicate entry",
                        error: "Group already exists",
                        status: 400,
                    })
                }

                const result = await db.collection('groups').insertOne({
                    group
                });

                return res.json({
                    message: "Success",
                    data: await db.collection('groups').findOne({ _id: result.insertedId }),
                    status: 201,
                })
            })
            .catch(error => {
                return res.status(400).send({
                    message: "Validation failed",
                    error: error,
                    status: 400,
                })
            })
    }


    return res.status(405).json({
        message: "METHOD NOT SUPPORTED",
        error: "METHOD NOT FOUND",
        status: 405
    });
}