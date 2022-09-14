// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { POST } from "../../../lib/constants/http.methods.constant";
import { HTTPErrorDTO, HTTPSuccessDTO } from "../../../dtos/HTTP.dto";
import { connectToDatabase } from "../../../lib/mongodb";
import { Helpers } from "../../../lib/helpers";
import nextConnect from "next-connect";
import multer from "multer";
import Excel from "exceljs";
import StudentModel from "../../../models/student.model";
import * as bcrypt from "bcrypt";

const workbook = new Excel.Workbook();

interface FileType {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	destination: string;
	filename: string;
	path: string;
	size: number;
}

interface ExcelRowValue {
	values: Array<string>;
}

/**
 * SINCE THE DEFAULT NEXTAPIREQUEST DOES NOT SUPPORT FILE
 * LET TYPESCRIPT KNOW THAT THE FILES HAVE BEEN ATTACHED BY MULTER
 */
interface AugmentedNextApiRequest extends NextApiRequest {
	files: Array<FileType>;
}

// Returns a Multer instance that provides several methods for generating
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
	storage: multer.diskStorage({
		destination: "./public/uploads",
		filename: (req, file, cb) => cb(null, file.originalname),
	}),
});

const apiRoute = nextConnect({
	/* ... */
});

// Returns middleware that processes multiple files sharing the same field name.
const uploadMiddleware = upload.array("file");

// Adds the middleware to Next-Connect
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req: AugmentedNextApiRequest, res: NextApiResponse) => {
	const { db } = await connectToDatabase();
	/**
	 * EXTRACT THE UPLOADED FILE FROM THE REQUEST BODY
	 */

	const file: FileType = req.files[0];

	/**
	 * CHECK IF FILE IS UPLOADED
	 */
	if (!file) {
		return res.status(400).send({
			message: "No File",
			error: "You must upload a CSV or Excel file",
			status: 400,
		});
	}

	const uploadedStudents: Array<any> = [];

	const fileExtension: string = file.filename.split(".")[1];
	/**
	 * MAKE SURE UPLOADED FILE IS A CSV OR EXCEL FILE FORMAT
	 */
	if (fileExtension.toLowerCase() !== "csv") {
		return res.status(400).send({
			message: "Unsupported File",
			error: "You must upload a CSV",
			status: 400,
		});
	}

	if (fileExtension == "csv") {
		return workbook.csv.readFile(file.path).then(async function (worksheet) {
			/**
			 * THE @ts-ignore DIRECTIVE WAS USED AS THE CSV LIBRARY IS OLD.
			 */
			await worksheet.eachRow(
				{ includeEmpty: true },
				//@ts-ignore
				async function (row: ExcelRowValue, rowNumber) {
					if (rowNumber !== 1) {
						/**
						 * CHECK IF STUDENT ALREADY EXIST
						 */

						if (
							await db
								.collection("users")
								.findOne({ registrationNumber: row.values[2] })
						) {
							return res.status(400).send({
								message: "Duplicate Registration",
								error: `A student with registration number ${row.values[2]} already exist`,
								status: 400,
							});
						}

						if (
							await db.collection("users").findOne({ email: row.values[3] })
						) {
							return res.status(400).send({
								message: "Duplicate Registration",
								error: `A user with email ${row.values[3]} already exist`,
								status: 400,
							});
						}

						const studentGroup = await db
							.collection("groups")
							.findOne({ group: row.values[5] });

						if (!studentGroup) {
							return res.status(404).send({
								message: "Not Found",
								error: `Group set for student with email ${row.values[3]} not found`,
								status: 404,
							});
						}

						const studentRecord = {
							name: row.values[1],
							registrationNumber: row.values[2],
							email: row.values[3],
							password: await bcrypt.hash(row.values[4], 10),
							groupId: studentGroup?._id,
							role: "student",
							status: "ACTIVE",
						};

						const student = await db
							.collection("users")
							.insertOne(studentRecord);
						uploadedStudents.push({
							...studentRecord,
							_id: student.insertedId,
						});
					}
				}
			);
			return res.send({
				status: 201,
				message: "Students uploaded",
				data: uploadedStudents,
			});
		});
	} else {
		return workbook.xlsx.readFile(file.path).then(function () {
			var worksheet = workbook.getWorksheet("Sheet1");
			return worksheet.eachRow(
				{ includeEmpty: true },
				function (row, rowNumber) {
					console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
					return res.send({
						message: "Students uploaded successfully",
						data: null,
						status: 201,
					});
				}
			);
		});
	}
});

export default apiRoute;

export const config = {
	api: {
		bodyParser: false, // Disallow body parsing, consume as stream
	},
};
