import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useStoreContext } from "../../pages/_app";
import { toast } from "react-toastify";

export const useAuthHook = () => {
	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");

	// VARIABLES FOR WHEN A STUDENT WANTS TO LOG IN
	const [student, setStudent] = useState({
		registrationNumber: "",
		password: "",
		groupId: "",
	});

	// VARIABLES FOR RESET PASSWORD

	const [resetValues, setResetValues] = useState({
		token: "",
		password: "",
		email: "",
		passwordConfirmation: "",
	});

	const [loading, setLoading] = useState(false);

	// GET USER TOKEN FROM MOBX STORE

	const {
		DataStore: { token, resetEmail },
	} = useStoreContext();

	// DECLARE A VARIABLE FOR USEROUTER() , USED TO NAVIGATE THE APP THROUGH MULTIPLE PAGES

	const router = useRouter();

	const [values, setValues] = useState({
		name: "",
		email: "",
		role: "admin",
		password: "",
		passwordConfirmation: "",
	});

	const [resetPasswordEmail, setResetPasswordEmail] = useState("");

	const handleSubmit = async (e: any) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res = await axios.post(`/api/auth/register`, values);
			setLoading(false);
			location.assign("/home");
			if (res?.data?.error) {
				toast(res?.data?.error);
			} else {
				location.assign("/home");
				const data = res?.data?.data;
				const filterData = {
					accessToken: data.accessToken,
					user: data.user,
				};
				localStorage.setItem("auth", JSON.stringify(filterData));
			}
			localStorage.setItem("auth", JSON.stringify(res?.data));
		} catch (error: any) {
			console.log(error);
			toast(error?.response?.data?.error || error?.response?.data?.message);
			setLoading(false);
		}
	};

	const updateUserProfile = async (e: any, data: any) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res = await axios.patch(`/api/auth/profile`, data, {
				headers: {
					"Access-Control-Allow-Headers": "x-access-token",
					"X-AccessToken": ` ${token}`,
				},
			});
			setLoading(false);

			if (res?.data?.error) {
				toast(res?.data?.error);
			} else {
			}
		} catch (error: any) {
			toast(error?.response?.data?.error || error?.response?.data?.message);
			setLoading(false);
		}
	};

	const handleStudentId = (
		value: string,
		field: "reg" | "group" | "password"
	) => {
		switch (field) {
			case "reg":
				setStudent({
					...student,
					registrationNumber: value,
				});
				break;
			case "group":
				setStudent({
					...student,
					groupId: value,
				});
				break;
			case "password":
				setStudent({
					...student,
					password: value,
				});
				break;
			default:
				break;
		}
	};

	const handleLogin = async (e: any) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res = await axios.post(`/api/auth/login`, {
				email,
				password,
			});

			if (res?.data?.error) {
				toast(res?.data?.error);
			} else {
				location.assign("/home");

				const data = res?.data?.data;
				const filterData = {
					accessToken: data.accessToken,
					user: data.user,
				};
				localStorage.setItem("auth", JSON.stringify(filterData));
			}
			setLoading(false);
		} catch (error: any) {
			toast(error?.response?.data?.error);
			setLoading(false);
		}
	};

	const handleInput = (type: "email" | "password", value: string) => {
		if (type === "email") {
			setEmail(value);
		} else if (type === "password") {
			setPassword(value);
		}
	};

	const handleStudentLogin = async (e: any) => {
		e.preventDefault();
		try {
			const res = await axios.post(`/api/auth/login/student`, {
				studentId: student.registrationNumber,
				groupName: student.groupId,
				password: student.password,
			});

			if (res?.data?.error) {
				toast(res?.data?.error);
			} else {
				window.location.assign("/home");
				const data = res?.data?.data;
				const filterData = {
					accessToken: data.accessToken,
					user: data.student,
				};
				localStorage.setItem("auth", JSON.stringify(filterData));
			}
			setLoading(false);
		} catch (error: any) {
			toast(error?.response?.data?.error);
			setLoading(false);
		}
	};

	const handleForgotPassword = async (e: any) => {
		setLoading(true);
		e.preventDefault();

		try {
			const res = await axios.post(`/api/auth/password/send-code`, {
				email: resetPasswordEmail,
			});

			if (res?.data?.error) {
				toast(res?.data?.error);
			} else {
				router.push(`/email-sent?email=${resetPasswordEmail}`);
			}
			setLoading(false);
		} catch (error: any) {
			toast(error?.response?.data?.error);
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		if (resetValues.password !== resetValues.passwordConfirmation) {
			toast("Password must match");
		} else {
			setLoading(true);

			try {
				const res = await axios.post(`/api/auth/password/reset`, {
					email: resetValues.email,
					code: resetValues.token,
					password: resetValues.password,
					passwordConfirmation: resetValues.passwordConfirmation,
				});

				if (res?.data?.error) {
					toast(res?.data?.error);
				} else {
					router.push("/auth/student");
				}
				setLoading(false);
			} catch (error: any) {
				toast(error?.response?.data?.error);

				setLoading(true);
			}
		}
	};
	const disabled = email.trim().length === 0 || password.trim().length === 0;

	return {
		email,
		password,
		setValues,
		values,
		disabled,
		handleLogin,
		updateUserProfile,
		handleResetPassword,
		setResetValues,
		resetValues,
		setResetPasswordEmail,
		loading,
		student,
		handleStudentId,
		handleForgotPassword,
		handleStudentLogin,
		handleSubmit,
		handleInput,
	};
};
