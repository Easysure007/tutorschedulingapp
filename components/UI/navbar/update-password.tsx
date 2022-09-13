import { TextField } from "../TextField/textfield";
import { Spacer, Button, Spinner } from "@chakra-ui/react";

import { useStudentHook } from "../../dashboard/users/students/students.hook";

export const UpdatePassword = () => {
	const { updateUser, loading, createStudentData, handleCreateStudentData } =
		useStudentHook();
	return (
		<>
			<TextField
				label="Password"
				type="password"
				value={createStudentData.password}
				placeholder="Password"
				onChange={(e) => handleCreateStudentData("password", e.target.value)}
			/>
			<Spacer height="20px" />
			<TextField
				label="Password Confirmation"
				type="password"
				value={createStudentData.passwordConfirmation}
				placeholder="Confirm Password"
				onChange={(e) =>
					handleCreateStudentData("passwordConfirmation", e.target.value)
				}
			/>
			<Spacer height="20px" />
			<Button
				background="purple.300"
				color="white"
				width="full"
				onClick={() =>
					updateUser({
						password: createStudentData.password,
						passwordConfirmation: createStudentData.passwordConfirmation,
					})
				}
				isDisabled={
					createStudentData.password.trim() === "" ||
					createStudentData.passwordConfirmation.trim() === "" ||
					createStudentData.password !== createStudentData.passwordConfirmation
				}
			>
				{loading ? <Spinner color="white" /> : "Change password"}
			</Button>
			<Spacer height="20px" />
		</>
	);
};
