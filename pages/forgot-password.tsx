import { Button, Text, Box, Heading, Spacer, Spinner } from "@chakra-ui/react";
import { useAuthHook } from "../components/auth/auth-hook";
import { useStoreContext } from "./_app";
import { TextField } from "../components/UI/TextField/textfield";

export default function ForgotPassword() {
	const { handleForgotPassword, loading, setResetPasswordEmail } =
		useAuthHook();
	const {
		DataStore: { updateResetEmail },
	} = useStoreContext();
	return (
		<Box
			width="100%"
			display={"flex"}
			mt="100"
			justifyContent="center"
			alignItems={"center"}
			flexDirection="column"
		>
			<Heading>Forgot Your Password?</Heading>
			<Spacer height={"40px"} />
			<Text align={"center"} mt="5">
				Enter your primary email address and <br /> we’ll send you instructions
				on how to reset your password.
			</Text>
			<Box width={"30%"}>
				<Spacer height={"20px"} />
				<TextField
					placeholder="Email"
					type="text"
					onChange={(e) => {
						updateResetEmail(e.target.value);
						setResetPasswordEmail(e.target.value);
					}}
				/>
				<Spacer height={"20px"} />
				<Box
					display="flex"
					alignItems={"center"}
					justifyContent="center"
					flexDir={"column"}
				>
					<Button
						background={"purple.500"}
						color="white"
						onClick={(e) => handleForgotPassword(e)}
					>
						{loading ? <Spinner color="white" /> : "Send Instructions"}
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
