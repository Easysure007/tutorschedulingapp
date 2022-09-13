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
    const studentId: string = req.query.studentId?.toString() || '';
    const { db } = await connectToDatabase();
    if (req.method === GET) {
        try {
            let student;
            if (Helpers.isValidObjectId(studentId)) {
                student = await db.collection('users').findOne({ $or: [{ _id: new ObjectId(studentId), role: 'student' }, { registrationNumber: studentId, role: 'student' }] });
            } else {
                student = await db.collection('users').findOne({ registrationNumber: studentId, role: 'student' })
            }
            if (!student) {
                return res.status(404).send({
                    message: `Not Found`,
                    status: 404,
                    error: `Student with ID: ${studentId} was not found`,
                })
            }
            return res.send({
                message: `Student with ID: ${studentId}`,
                status: 200,
                data: student,
            })
        } catch (error) {
            console.log(error)
            return res.status(404).send({
                message: `Not Found`,
                status: 404,
                error: `Student with ID: ${studentId} was not found`,
            })
        }


    }
    return res.status(405).send({
        message: "METHOD NOT SUPPORTED",
        error: "METHOD NOT FOUND",
        status: 405
    })
}