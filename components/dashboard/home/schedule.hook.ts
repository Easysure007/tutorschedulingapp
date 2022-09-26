import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState, useCallback } from "react";
import { useStoreContext } from "../../../pages/_app";

export const useScheduleHook = () => {
	// GETS DATA FROM THE STORE

	const {
		DataStore: { token, user, reload, setReload },
	} = useStoreContext();

	const [getAllSchedule, setGetAllSchedule] = useState<any>([]);
	const [selectedSchedule, setSelectedSchedule] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const [editNote, setEditNote] = useState(false);
	const [note, setNote] = useState("");

	// FUNCTION USED TO  FETCH ALL SCHEDULES FOR A LOGGED IN STUDENT FROM THE BACKEND

	const scheduleAvailability = useCallback(async () => {
		try {
			const res = await axios.get(`/api/group/${user?.groupId}/schedule`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${token}`,
				},
			});
			setGetAllSchedule(res.data.data);
		} catch (error: any) {
			toast(error?.message);
		}
	}, []);

	// FUNCTION USED TO  FETCH ALL SCHEDULES FOR A PARTICULAR GROUP FROM THE BACKEND , THE FUNCTION ACCEPTS A GROUP ID

	const getCordinatorGroup = async (id: string) => {
		setLoading(true);
		try {
			const res = await axios.get(`/api/group/${id}/schedule`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${token}`,
				},
			});
			setLoading(false);

			setGetAllSchedule(res.data.data);
		} catch (error: any) {
			toast(error?.message);
			setLoading(false);
		}
	};

	// HOOK USED TO CALL THE GET STUDENT SCHEDULES UPON PAGE LOAD WHEN THE USER IS A STUDENT

	useEffect(() => {
		if (user?.role === "student") scheduleAvailability();
	}, [scheduleAvailability, user?.role]);

	// FUNCTION USED TO  FETCH ALL SCHEDULES FOR A TUTOR FROM THE BACKEND

	const getTutorSchedule = useCallback(async () => {
		setLoading(true);
		if (reload) setReload(false);

		try {
			const res = await axios.get(`/api/instructor/${user?.id}/schedule`, {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${token}`,
				},
			});
			setGetAllSchedule(res.data.data);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	}, [reload]);

	// HOOK USED TO CALL THE GET STUDENT SCHEDULES UPON PAGE LOAD WHEN THE USER IS A TUTOR

	useEffect(() => {
		if (user?.role === "instructor") getTutorSchedule();
	}, [getTutorSchedule, user?.role]);

	// FUNCTION FOR TUTORS  USED TO ACCEPT OR REJECT  SCHEDULES

	const handleAcceptSchedule = async (
		id: string,
		status: "accept" | "reject"
	) => {
		try {
			await axios.post(
				`/api/schedule/${id}/${status}`,
				{},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Headers": "x-access-token",
						"X-AccessToken": ` ${token}`,
					},
				}
			);
			setReload(true);
			toast(status === "accept" ? "Schedule accepted" : "Schedule rejected");
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	};

	// FUNCTION FOR TUTORS USED TO CREATE OR UPDATE NOTES

	const handleNote = async (id: string, edit: boolean) => {
		try {
			if (edit) {
				await axios.patch(
					`/api/schedule/${id}/update-note`,
					{
						note: note,
					},
					{
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Headers": "x-access-token",
							"X-AccessToken": ` ${token}`,
						},
					}
				);
				setEditNote(false);
			} else {
				await axios.post(
					`/api/schedule/${id}/complete`,
					{
						note: note,
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
			if (edit) {
				toast("Note Edited Succesfully");
			} else {
				toast("Class completed");
			}
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	};

	const handleEditNote = async (id: string) => {
		try {
			await axios.post(
				`/api/schedule/${id}/update-note`,
				{
					note: note,
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Headers": "x-access-token",
						"X-AccessToken": ` ${token}`,
					},
				}
			);
			setReload(true);
			toast("Class completed");
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast(error?.response?.data?.error || error?.response?.data?.message);
		}
	};

	return {
		getAllSchedule,
		handleAcceptSchedule,
		loading,
		setNote,
		handleNote,
		getCordinatorGroup,
		getTutorSchedule,
		editNote,
		setEditNote,
		note,
		handleEditNote,
		setSelectedSchedule,
		selectedSchedule,
	};
};
