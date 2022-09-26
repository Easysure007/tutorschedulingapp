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

	// HANLDES THE LOGIC FOR UPDATING THE LOGIN VALUES WHEN A USER INPUTS EITHIER EMAIL OR PASSWORD

	const handleInput = (type: "email" | "password", value: string) => {
		if (type === "email") {
			setEmail(value);
		} else if (type === "password") {
			setPassword(value);
		}
	};

	// FUNCTION USED TO CALL THE POST LOGIN  METHOD TO THE BACKEND PASSING IN THE USER GROUP_ID, PASSWORD AND STUDENT ID

	const handleStudentLogin = async (e: any) => {
		e.preventDefault();
		try {
			const res = await axios.post(`/api/auth/login/student`, {
				studentId: student.registrationNumber,
				groupId: student.groupId,
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

	// FUNCTION USED TO CALL THE POST FORGOT PASSWORD ENDPOINT, TRIGGERS WHEN A USER CLICKS 'CONTINUE' ON FORGOT PASSWORD PAGE
	// SENDS THE RESET PASSWORD CODE TO THE USER EMAIL

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
	// FUNCTION USED TO CALL THE POST RESET PASSWORD ENDPOINT, TRIGGERS AFTER A USER INPUTS THE CODE SENT TO EMAIL, NEW PASSWORD

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

	// DISABLES THE LOGIN BUTTON WHEN THE EMAIL AND PASSWORD INPUT FIELD ARE EMPTY

	const disabled = email.trim().length === 0 || password.trim().length === 0;

	// EXPORTS ALL THE METHODS AND FUNCTIONS SO IT CAN BE USED ROUND THE APPLICATION

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

		handleInput,
	};
};
