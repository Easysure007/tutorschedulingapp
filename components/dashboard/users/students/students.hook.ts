import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { storeData } from "../../../../store/dataStore";
import { useStoreContext } from "../../../../pages/_app";
import { getAllStudents } from "./students.requests";

export const useStudentHook = () => {
	const [allStudents, setAllStudents] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);

	const {
		DataStore: {
			reload: storeReload,
			user,
			setReload: setStoreReload,
			updateUser: updateUserFromLocalStorage,
		},
	} = useStoreContext();

	const router = useRouter();

	const [createStudentData, setCreateStudentData] = useState({
		registrationNumber: "",
		name: "",
		email: "",
		password: "",
		passwordConfirmation: "",
		groupId: "",
	});

	// USED TO GET ALL STUDENTS ON THE APPLICATION

	const getStudents = useCallback(async () => {
		setLoading(true);
		if (reload) setReload(false);
		try {
			const res: any = await getAllStudents();
			setAllStudents(res.data);
			setLoading(false);
		} catch {
			setLoading(false);
		}
	}, [reload]);

	const disabled = false;

	// HANDLES THE LOGIC FOR THE INPUT FIELD VALUE USED TO CREATE A STUDENT  DEPENDING ON THE INPUT FIELD

	const handleCreateStudentData = (
		type:
			| "registrationNumber"
			| "name"
			| "group"
			| "email"
			| "password"
			| "passwordConfirmation",
		value: string
	) => {
		switch (type) {
			case "registrationNumber":
				setCreateStudentData({
					...createStudentData,
					registrationNumber: value,
				});
				break;
			case "name":
				setCreateStudentData({ ...createStudentData, name: value });
				break;
			case "group":
				setCreateStudentData({ ...createStudentData, groupId: value });
				break;
			case "email":
				setCreateStudentData({ ...createStudentData, email: value });
				break;

			case "password":
				setCreateStudentData({ ...createStudentData, password: value });
				break;

			case "passwordConfirmation":
				setCreateStudentData({
					...createStudentData,
					passwordConfirmation: value,
				});
			default:
				break;
		}
	};
	const [uploadedFile, setUploadedFile] = useState<any>();

	// HOOK USED TO CALL THE GET STUDENTS UPON THE PAGE LOAD

	useEffect(() => {
		getStudents();
	}, [getStudents]);

	// HANDLE UPLOADING STUDENTS INTO THE APPLICATION

	const handleUploadStudents = async () => {
		var bodyFormData = new FormData();
		bodyFormData.append("file", uploadedFile);

		try {
			const res = await axios.post(`/api/auth/upload-students`, bodyFormData, {
				headers: {
					"Access-Control-Allow-Headers": "x-access-token",
					"Content-Type": "multipart/form-data",
					"X-AccessToken": ` ${storeData.token}`,
				},
			});
			res && toast("Upload Successful");
		} catch (error) {
			console.log(error);
		}
	};

	// HANDLE UPDATING  A USER DETAILS

	const updateUser = async (data: any) => {
		setLoading(true);

		const auth: any = localStorage.getItem("auth");
		const localData = JSON.parse(auth);

		try {
			const res = await axios.patch(`/api/auth/profile`, data, {
				headers: {
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${storeData.token}`,
				},
			});
			localData.user = res.data.data;

			localStorage.setItem("auth", JSON.stringify(localData));
			updateUserFromLocalStorage();
			res && setReload(true);
			res && setLoading(false);
			res && router.push("/");
			res && router.push("/home");
			res && toast("Update successfully");
		} catch {
			setLoading(false);
		}
	};

	// HANDLE EDITING A USER DETAILS

	const editStudent = async (data: any, userId: string) => {
		setLoading(true);
		try {
			const res = await axios.patch(`/api/instructor/${userId}`, data, {
				headers: {
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${storeData.token}`,
				},
			});
			res && setReload(true);
			res && setLoading(false);
			res && toast(`Student Information updated`);
		} catch {
			setLoading(false);
		}
	};

	// HANDLE DEACTIVATING USER USED BY MODULE COORDINATOR

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
						"X-AccessToken": ` ${storeData.token}`,
					},
				}
			);
			res && setReload(true);
			res && setLoading(false);
			res && toast(`Student ${status[0].toUpperCase() + status.substring(1)}`);

			res &&
				setAllStudents(
					allStudents
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

	// HANDLE CREATING A USER BY MODULE COORDINATOR

	const handleSubmit = async (e: any, type: any) => {
		setLoading(true);
		e.preventDefault();
		try {
			if (type === "admin") {
				const res = await axios.post(
					`/api/auth/register`,
					{
						email: createStudentData.email,
						role: "cordinator",
						password: createStudentData.password,

						passwordConfirmation: createStudentData.passwordConfirmation,
						name: createStudentData.name,
					},
					{
						headers: {
							"Access-Control-Allow-Headers": "x-access-token",
							"X-AccessToken": ` ${storeData.token}`,
						},
					}
				);
				setLoading(false);
				setReload(true);
				setStoreReload(true);
				if (res?.data?.error) {
					toast(res?.data?.error);
				} else {
				}
				return "Success";
			} else if (type === "user") {
				const res = await axios.post(
					`/api/student`,
					{
						email: createStudentData.email,
						registrationNumber: createStudentData.registrationNumber,
						role: "student",
						password: createStudentData.password,
						passwordConfirmation: createStudentData.passwordConfirmation,
						groupId: createStudentData.groupId,
						name: createStudentData.name,
					},
					{
						headers: {
							"Access-Control-Allow-Headers": "x-access-token",
							"X-AccessToken": ` ${storeData.token}`,
						},
					}
				);
				setLoading(false);
				setReload(true);
				setStoreReload(true);
				if (res?.data?.error) {
					toast(res?.data?.error);
				} else {
				}
			} else if (type === "instructor") {
				const res = await axios.post(
					`/api/auth/register`,
					{
						email: createStudentData.email,
						role: "instructor",
						isAnonymous: true,
						password: createStudentData.password,
						passwordConfirmation: createStudentData.passwordConfirmation,
						name: createStudentData.name,
					},
					{
						headers: {
							"Access-Control-Allow-Headers": "x-access-token",
							"X-AccessToken": ` ${storeData.token}`,
						},
					}
				);
				setLoading(false);
				setReload(true);
				setStoreReload(true);
				if (res?.data?.error) {
					toast(res?.data?.error);
				} else {
				}
				return "Success";
			}
		} catch (error: any) {
			toast(error?.response?.data?.error || error?.response?.data?.message);
			setLoading(false);
		}
	};
	return {
		allStudents,
		disabled,
		loading,
		createStudentData,
		handleUploadStudents,

		editStudent,
		uploadedFile,
		setUploadedFile,
		updateUser,
		setCreateStudentData,
		deactivateUser,
		handleSubmit,
		handleCreateStudentData,
	};
};
