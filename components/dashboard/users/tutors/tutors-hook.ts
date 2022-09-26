import { getAllInstructors, createSchedule } from "./tutors.requests";
import { useStoreContext } from "../../../../pages/_app";
import axios from "axios";
import { toast } from "react-toastify";
import { storeData } from "../../../../store/dataStore";
import { useState, useEffect, useCallback } from "react";

export const useTutorHook = () => {
	const [allInstructors, setAllInstructor] = useState<any>([]);
	const [getAvailabilityID, setGetAvailabilityID] = useState("");
	const [groupId, setGroupId] = useState("");
	const [editReload, setEditReload] = useState(false);
	const [loading, setLoading] = useState(false);

	const {
		DataStore: { reload, setReload },
	} = useStoreContext();

	// GET ALL TUTORS FUNCTION

	const getInstructor = useCallback(async () => {
		setLoading(true);

		try {
			if (reload === true) setReload(false);
			const res: any = await getAllInstructors();
			setAllInstructor(res.data);
			setLoading(false);
		} catch {
			setLoading(false);
		}
	}, [reload, setReload]);

	// REACT HOOKS USED TO CALL THE GET INSTRUCTORS FUNCTION UPON PAGE LOAD

	useEffect(() => {
		if (editReload === true) setEditReload(false);

		getInstructor();
	}, [getInstructor, editReload]);

	// TO UPDATE THE TUTOR ANONYMITY

	const editTutor = async (data: any, userId: string) => {
		setLoading(true);
		try {
			const res = await axios.patch(`/api/instructor/${userId}`, data, {
				headers: {
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${storeData.token}`,
				},
			});
			setEditReload(true);
			res && toast(`Student Anonymity updated`);
		} catch {
			setLoading(false);
		}
	};

	// FUNCTION TO CREATE SCHEDULES

	const createSchedules = async () => {
		try {
			const res = await createSchedule(getAvailabilityID, groupId);
		} catch {}
	};

	const deactivateInstructor = async (
		userId: string,
		status: "active" | "inactive"
	) => {
		setLoading(true);
		try {
			const res = await axios.patch(
				`/api/instructor/${userId}`,
				{
					status: status.toUpperCase(),
				},
				{
					headers: {
						"Access-Control-Allow-Headers": "x-access-token",
						"X-AccessToken": ` ${storeData.token}`,
					},
				}
			);
			res && setReload(true);
			res && setLoading(false);
			res && toast(`Tutor ${status[0].toUpperCase() + status.substring(1)}`);

			res &&
				setAllInstructor(
					allInstructors
						?.filter((item: any) => item._id === userId)
						.map((item: any) => {
							return {
								...item,
								status: status.toUpperCase(),
							};
						})
				);
		} catch {
			setLoading(false);
		}
	};

	return {
		allInstructors,
		setGetAvailabilityID,
		setGroupId,
		editTutor,
		loading,
		deactivateInstructor,
		createSchedules,
	};
};
