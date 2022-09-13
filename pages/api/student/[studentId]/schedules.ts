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

        let student;
        if (Helpers.isValidObjectId(studentId)) {
            student = await db.collection('users').findOne({ $or: [{ _id: new ObjectId(studentId), role: 'student' }, { registrationNumber: studentId, role: 'student' }] });
        } else {
            student = await db.collection('users').findOne({ registrationNumber: studentId, role: 'student' })
        }

        if (student) {
            return res.status(404).json({
                message: "Not Found",
                error: `Student with ID ${studentId} does not exist`,
                status: 404
            });
        }


        const schedules = await db.collection('schedules').find({ groupId: new ObjectId(student.groupId) }).toArray();

        if (!schedules) {
            return res.status(404).json({
                message: "Not Found",
                error: `No Schedules found for instructor with ID ${studentId}`,
                status: 404
            });
        }

        return res.json({
            message: "Student Schedules",
            data: schedules,
            status: 200,
        })

    }
    return Helpers.unsupportedMethodException(res);
}
