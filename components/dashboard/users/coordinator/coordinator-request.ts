import axios from "axios";
import { storeData } from "../../../../store/dataStore";
import { toast } from "react-toastify";

interface IcreateStudent {
	name: string;
	groupId: string;
	registrationNumber: string;
}

// ENDPOINT TO GET ALL CORDINATORS

export const getAllCordinators = async () => {
	try {
		const res = await axios.get("/api/coordinator", {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Headers": "x-access-token",
				"X-AccessToken": ` ${storeData.token}`,
			},
		});
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};

// ENDPOINT TO GET A PARTICULAR STUDENT SCHEDULE OR GENERAL INFORMATION

export const getStudent = async (id: string, schedules?: boolean) => {
	try {
		const res = await axios.get(
			`/api/student/${id}/${schedules ? "schedules" : ""}`,
			{
				headers: {
					Authorization: `token ${storeData.token}`,
				},
			}
		);
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};

// ENDPOINT TO CREATE A STUDENT

export const createStudent = async (data: IcreateStudent) => {
	try {
		const res = await axios.post(`/api/student/`, data, {
			headers: {
				Authorization: `token ${storeData.token}`,
			},
		});
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};
