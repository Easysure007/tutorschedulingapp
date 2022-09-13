import axios from "axios";
import { toast } from "react-toastify";
import { storeData } from "../../../store/dataStore";

export const getAvailability = async () => {
	try {
		const res = await axios.get("/api/availability", {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Headers": "x-access-token",
				"X-AccessToken": ` ${storeData.token}`,
			},
		});
		return res.data.data;
	} catch (error: any) {
		toast(error?.message);
	}
};
