import { TextField } from "../TextField/textfield";
import { useMemo, useState } from "react";
import { useStoreContext } from "../../../pages/_app";
import { Spinner } from "@chakra-ui/react";
import { useStudentHook } from "../../dashboard/users/students/students.hook";
import { Box, Spacer, Button } from "@chakra-ui/react";
export const EditProfile = () => {
	const {
		DataStore: { user },
	} = useStoreContext();
	const [updateName, setUpdateName] = useState(true);
	const { updateUser, loading, createStudentData, handleCreateStudentData } =
		useStudentHook();

	useMemo(() => {
		if (user?.name && updateName) {
			handleCreateStudentData("name", user?.name);
			setUpdateName(false);
		}
	}, [user, handleCreateStudentData]);
	return (
		<>
			<Box>
				{user?.role === "student" && (
					<>
						<TextField
							label=" ID"
							type="text"
							value={user?.registrationNumber}
							disabled={true}
							placeholder="E.g RG3001"
							onChange={(e) => null}
						/>
						<Spacer height="20px" />
					</>
				)}

				<TextField
					label=" Email"
					type="text"
					disabled={true}
					value={user?.email}
					placeholder="E.g student@gmail.com"
					onChange={(e) => null}
				/>
				<Spacer height="20px" />
				<TextField
					label="Full Name"
					type="text"
					value={createStudentData.name}
					placeholder="E.g Ray King"
					onChange={(e) => handleCreateStudentData("name", e.target.value)}
				/>
				<Spacer height="20px" />
				<Button
					background="purple.300"
					color="white"
					width="full"
					isDisabled={createStudentData.name.trim() === ""}
					onClick={() => {
						updateUser({
							name: createStudentData.name,
						});
					}}
				>
					{loading ? <Spinner color="white" /> : "	Edit profile"}
				</Button>
				<Spacer height="20px" />
			</Box>
		</>
	);
};
