import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useStoreContext } from "../../../pages/_app";

export const useAvailability = () => {
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	const [getTutorAvail, setGetTutorAvail] = useState([]);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [dateTime, setDateTime] = useState<any>({
		date: "",
		time: "",
	});
	const {
		DataStore: { token, user },
	} = useStoreContext();
	const [duration, setDuration] = useState<any>(0);

	const handleCreateAvailability = async () => {
		setSubmitLoading(true);
		try {
			{
				await axios.post(
					"/api/availability",
					{
						duration: duration,
						availabilityTime: dateTime.time,
						availabilityDate: dateTime.date,
					},
					{
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Headers": "x-access-token",
							"X-AccessToken": ` ${token}`,
						},
					}
				);
			}
			setReload(true);
			setSubmitLoading(false);
		} catch (error: any) {
			setSubmitLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	};
	const getTutorAvailability = useCallback(async () => {
		setLoading(true);
		try {
			const res = await axios.get(`/api/instructor/${user?.id}/availability`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${token}`,
				},
			});
			if (reload) setReload(false);
			setGetTutorAvail(res?.data?.data);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	}, [reload]);

	useEffect(() => {
		getTutorAvailability();
	}, [getTutorAvailability]);

	return {
		dateTime,
		setDateTime,
		duration,
		submitLoading,
		getTutorAvail,
		loading,
		setDuration,
		handleCreateAvailability,
	};
};
