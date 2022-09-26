import axios from "axios";
import { storeData } from "../../../../store/dataStore";
import { toast } from "react-toastify";

interface IcreateInstructor {
	name: string;
	groupId: string;
	registrationNumber: string;
}

// ENDPOINT REQUEST TO  GET ALL TUTORS IN THE SYSTEM

export const getAllInstructors = async () => {
	try {
		const res = await axios.get("/api/instructor", {
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

// ENDPOINT REQUEST TO  GET A TUTOR DETAILS SUCH AS SCHEDULES OR GENERAL INFORMATION

export const getInstructor = async (id: string, schedules?: boolean) => {
	try {
		const res = await axios.get(
			`/api/instructor/${id}/${schedules ? "schedules" : ""}`,
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

// ENDPOINT REQUEST TO CREATE A TUTOR, USED BY MODULE CORDINATORS

export const createInstructor = async (data: IcreateInstructor) => {
	try {
		const res = await axios.post(`/api/instructor/`, data, {
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

// ENDPOINT REQUEST TO CREATE A SCHEDULE BY A TUTOR

export const createSchedule = async (data: string, groupId: string) => {
	try {
		const res = await axios.post(
			`/api/schedule/`,
			{
				availabilityId: data,
				registrationNumber: storeData.user?.data?.user?.id,
				groupId: groupId,
			},
			{
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${storeData.token}`,
				},
			}
		);
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};
