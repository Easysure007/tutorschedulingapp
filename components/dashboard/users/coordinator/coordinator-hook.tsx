import { useState, useEffect, useCallback } from "react";
import { getAllCordinators } from "./coordinator-request";
import { useStoreContext } from "../../../../pages/_app";

export const useCordinatorHook = () => {
	const [allCordinators, setAllCordinators] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const {
		DataStore: { reload, setReload },
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

	return {
		allCordinators,
		loading,
	};
};
