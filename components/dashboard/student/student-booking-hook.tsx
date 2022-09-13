import { useCallback, useState } from "react";
import { useStoreContext } from "../../../pages/_app";
import axios from "axios";
import { toast } from "react-toastify";

export const useStudentBookingHook = () => {
	const [loading, setLoading] = useState(false);
	const [getTutorAvail, setGetTutorAvail] = useState([]);
	const [searchValue, setSearchValue] = useState("");

	const [availabilityId, setAvailabilityID] = useState("");
	const {
		DataStore: { token },
	} = useStoreContext();
	const getTutorAvailability = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const res = await axios.get(`/api/instructor/${id}/availability`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${token}`,
				},
			});

			setGetTutorAvail(res?.data?.data);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	}, []);
	const handleCreateSchedule = async () => {
		try {
			const res = await axios.post(
				`/api/schedule`,
				{
					availabilityId: availabilityId,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Headers": "x-access-token",
						"X-AccessToken": ` ${token}`,
					},
				}
			);

			toast("Successfull");
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	};
	return {
		getTutorAvailability,
		getTutorAvail,
		availabilityId,
		loading,
		searchValue,
		setSearchValue,
		handleCreateSchedule,
		setAvailabilityID,
	};
};
