import {
	Button,
	Text,
	Flex,
	Box,
	Heading,
	Spacer,
	Spinner,
} from "@chakra-ui/react";

import { useAuthHook } from "../components/auth/auth-hook";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { TextField } from "../components/UI/TextField/textfield";

export default function EmailSent() {
	const router = useRouter();
	const { handleResetPassword, resetValues, setResetValues, loading } =
		useAuthHook();

	useEffect(() => {
		if (router.query?.email) {
			if (resetValues.email === "") {
				const email: any = router.query?.email;
				setResetValues({ ...resetValues, email: email });
			}
		}
	}, [resetValues, setResetValues]);

	return (
		<Box
			width="100%"
			display={"flex"}
			mt="100"
			justifyContent="center"
			alignItems={"center"}
			flexDirection="column"
		>
			<Heading>Reset Password</Heading>
			<Spacer height={"40px"} />
			<Text align={"center"} mt="5" color={"#5f5f8c"}>
				Enter your code sent to your email address.
			</Text>
			<Box width={"30%"}>
				<Spacer height={"20px"} />
				<TextField
					placeholder="Email address"
					label="Email address"
					value={resetValues.email}
					disabled={true}
					type="text"
					onChange={() => null}
				/>
				<Spacer height={"20px"} />

				<TextField
					placeholder="Reset Token"
					label="Token"
					type="text"
					onChange={(e) =>
						setResetValues({ ...resetValues, token: e.target.value })
					}
				/>

				<Spacer height={"20px"} />
				<TextField
					placeholder="Password"
					type="password"
					label="Password"
					onChange={(e) =>
						setResetValues({ ...resetValues, password: e.target.value })
					}
				/>

				<Spacer height={"20px"} />
				<TextField
					placeholder="Password Confirmation"
					label="Password Confirmation"
					type="password"
					onChange={(e) =>
						setResetValues({
							...resetValues,
							passwordConfirmation: e.target.value,
						})
					}
				/>
				<Spacer height={"40px"} />
				<Box
					display="flex"
					alignItems={"center"}
					justifyContent="center"
					flexDir={"column"}
				>
					<Button
						background={"purple.500"}
						color="white"
						width="full"
						disabled={
							resetValues.password.trim() === "" ||
							resetValues.passwordConfirmation.trim() === "" ||
							resetValues.token === ""
						}
						height="50px"
						onClick={() => handleResetPassword()}
					>
						{loading ? <Spinner color="white" /> : "Reset Password"}
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
