import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateGroupDTO } from "../../../../dtos/CreateGroup.dto";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../../dtos/HTTP.dto";
import { GET, PATCH } from "../../../../lib/constants/http.methods.constant";
import { ACTIVE } from "../../../../lib/constants/status.constant";
import { Helpers } from "../../../../lib/helpers";
import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HTTPSuccessDTO | HTTPErrorDTO>,
) {
    const groupId: string = req.query.groupId?.toString() || '';
    const { db } = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    if (req.method === GET) {

        if (!Helpers.isValidObjectId(groupId)) {
            return res.status(404).json({
                message: "Not Found",
                error: `Group with ID ${groupId} does not exist`,
                status: 404
            });
        }

        const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

        if (!group) {
            return res.status(404).json({
                message: "Not Found",
                error: `Group with ID ${groupId} does not exist`,
                status: 404
            });
        }

        return res.json({
            message: "Single group",
            data: group,
            status: 200,
        })
    }

    if (req.method === PATCH) {
        if (!Helpers.isValidObjectId(groupId)) {
            return res.status(404).json({
                message: "Not Found",
                error: `Group with ID ${groupId} does not exist`,
                status: 404
            });
        }

        const groupData: CreateGroupDTO = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

        if (!groupData) {
            return res.status(404).json({
                message: "Not Found",
                error: `Group with ID ${groupId} does not exist`,
                status: 404
            });
        }

        const { group, status } = req.body;

        await groupsCollection.updateMany({ _id: new ObjectId(groupId) }, {
            $set: {
                group: group ?? groupData.group,
                status: status ?? groupData.status
            }
        });

        res.json({
            message: "All Updated",
            data: await await groupsCollection.findOne({ _id: new ObjectId(groupId) }),
            status: 200
        })
    }
    return Helpers.unsupportedMethodException(res);
}