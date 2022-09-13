import { useTutorHook } from "../users/tutors/tutors-hook";
import { getAvailability } from "./book.request";
import { useEffect, useState, useCallback } from "react";

export const useBookHook = () => {
	const [availability, setAvailability] = useState<any>([]);
	const [selectedInstructor, setSelectedInstructor] = useState<any>([]);
	const getAllAvailability = useCallback(async () => {
		try {
			const res = await getAvailability();
			setAvailability(res);
		} catch {}
	}, []);

	const makeSchedule = async (id: any) => {
		const tutor = availability?.filter((item: any) => item.instructorId === id);
	};

	useEffect(() => {
		getAllAvailability();
	}, [getAllAvailability]);

	return {
		setSelectedInstructor,
		makeSchedule,
		availability,
	};
};
