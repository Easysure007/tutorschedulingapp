import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export class Helpers {
    /**
     * EXTRACT THE CURRENTLY LOGGED IN USER FROM THE REQUEST OBJECT
     * @param req 
     * @returns 
     */
    static getRequestAuthData(req: NextApiRequest) {
        return JSON.parse(req.cookies['next-auth-user'] || "{}");
    }

    /**
     * CHECK FOR A VALID ObjectId
     * @param id 
     * @returns boolean
     */
    static isValidObjectId(id: string): boolean {
        try {
            new ObjectId(id).toString();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * UNSUPPORTED METHOD EXCEPTION.
     * CAN BE USED AT THE BOTTOM OF ALL API ROUTE 
     * TO RETURN THE ERROR WHEN NO CONDITION MATCH THE REQUEST METHOD
     * @param res 
     * @returns 
     */
    static unsupportedMethodException(res: NextApiResponse) {
        return res.status(405).json({
            message: "METHOD NOT SUPPORTED",
            error: "METHOD NOT FOUND",
            status: 405
        })
    }
}