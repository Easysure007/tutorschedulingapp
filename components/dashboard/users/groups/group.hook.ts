import {
	getAllGroups,
	getGroup,
	createGroup as createGroups,
} from "./group.requests";
import axios from "axios";
import { useStoreContext } from "../../../../pages/_app";
import { useState, useCallback, useEffect } from "react";

export const useGroupHook = () => {
	const [allGroup, setAllGroup] = useState<any>([]);

	const [group, setGroup] = useState<any>([]);

	const [createGroup, setCreateGroup] = useState("");

	const [viewSpecific, setViewSpecificGroup] = useState("");

	const [loading, setLoading] = useState(false);

	const handleGroupName = (value: string) => {
		setCreateGroup(value);
	};
	const [success, setSuccess] = useState(false);

	const {
		DataStore: { setGroups },
	} = useStoreContext();

	// FUNCTION USED TO GET ALL GROUPS IN THE APPLICATION

	const getGroups = useCallback(async () => {
		setLoading(true);
		try {
			const res: any = await getAllGroups();
			setAllGroup(
				res.data.data?.filter((item: any) => item.status !== "inactive")
			);
			setGroups(res.data.data);
			setLoading(false);

			if (success) {
				setSuccess(false);
			}
		} catch {
			setLoading(false);
		}
	}, [setGroups, success]);

	// HOOK THAT RUNS THE GET GROUP FUNCTION UPON PAGE LOAD

	useEffect(() => {
		getGroups();
	}, [getGroups]);

	// FUNCTION USED TO DELETE A GROUP

	const deleteGroup = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const res: any = await axios.patch(`/api/group/${id}`, {
				status: "inactive",
			});
			res && setSuccess(true);

			res && setLoading(false);
		} catch {
			setLoading(false);
		}
	}, []);

	// FUNCTION USED TO VIEW A GROUP DETAILS

	const viewGroup = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const res: any = await getGroup(id, true);
				setGroup(res.data.data);
				setLoading(false);
			} catch (error) {
				setLoading(false);
			}
		},
		[setGroup]
	);

	// FUNCTION USED TO CREATE A GROUP

	const handleCreateGroup = async () => {
		setLoading(true);
		try {
			await createGroups(createGroup);
			setSuccess(true);
			setLoading(false);
		} catch (error) {
			setLoading(true);
		}
	};

	return {
		allGroup,
		success,
		handleGroupName,
		handleCreateGroup,
		viewSpecific,
		setViewSpecificGroup,
		loading,
		setSuccess,
		deleteGroup,
		createGroup,
		viewGroup,
		group,
	};
};
