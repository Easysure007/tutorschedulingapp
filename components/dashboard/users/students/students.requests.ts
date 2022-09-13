import axios from "axios";
import { storeData } from "../../../../store/dataStore";
import { toast } from "react-toastify";

interface IcreateStudent {
	name: string;
	groupId: string;
	registrationNumber: string;
}

export const getAllStudents = async () => {
	try {
		const res = await axios.get("/api/student", {
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
