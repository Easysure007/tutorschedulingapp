import axios from "axios";
import { storeData } from "../../../../store/dataStore";
import { toast } from "react-toastify";

interface IcreateGroup {
	password: string;
	passwordConfirmation: string;
	name: string;
	email: string;
	role: string;
	groupId: string;
	registrationNumber: string;
}

export const getAllGroups = async () => {
	try {
		const res = await axios.get("/api/group", {
			headers: {
				"X-AccessToken": ` ${storeData.token}`,
			},
		});
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};

export const getGroup = async (id: string, students?: boolean) => {
	try {
		const res = await axios.get(
			`/api/group/${id}/${students ? "students" : ""}`,
			{
				headers: {
					"X-AccessToken": ` ${storeData.token}`,
				},
			}
		);
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};

export const createGroup = async (group: string) => {
	try {
		const res = await axios.post(
			`/api/group/`,
			{ group: group },
			{
				headers: {
					"X-AccessToken": ` ${storeData.token}`,
				},
			}
		);
		return res;
	} catch (error: any) {
		toast(error?.message);
	}
};
