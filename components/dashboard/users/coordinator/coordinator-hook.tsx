import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllCordinators } from "./coordinator-request";
import { useStoreContext } from "../../../../pages/_app";

export const useCordinatorHook = () => {
	const [allCordinators, setAllCordinators] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const {
		DataStore: { reload, setReload, token },
	} = useStoreContext();

	const getCordinators = useCallback(async () => {
		setLoading(true);
		if (reload) setReload(false);
		try {
			const res: any = await getAllCordinators();

			setAllCordinators(res.data?.data);
			setLoading(false);
		} catch {
			setLoading(false);
		}
	}, [reload]);

	useEffect(() => {
		getCordinators();
	}, [getCordinators]);
	const deactivateUser = async (
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
						"X-AccessToken": ` ${token}`,
					},
				}
			);
			res && setReload(true);
			res && setLoading(false);
			res &&
				toast(`Cordinator ${status[0].toUpperCase() + status.substring(1)}`);

			res &&
				setAllCordinators(
					allCordinators
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
		allCordinators,
		deactivateUser,
		loading,
	};
};
