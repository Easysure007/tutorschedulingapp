import {
	Text,
	Spacer,
	Button,
	Image,
	FormLabel,
	Select,
} from "@chakra-ui/react";
import { TextField } from "../../../components/UI/TextField/textfield";
import Link from "next/link";
import { useGroupHook } from "../../../components/dashboard/users/groups/group.hook";
import { useAuthHook } from "../../../components/auth/auth-hook";

const UserLogin = () => {
	const { student, handleStudentId, handleStudentLogin } = useAuthHook();

	const { allGroup } = useGroupHook();

	return (
		<div className="mainDiv">
			{" "}
			<section className="hero-section" style={{ paddingTop: "50px" }}>
				<div className="main" style={{ width: "30%" }}>
					<Text fontWeight={"800"} fontSize={"30px"}>
						Sign in to scheduler
					</Text>
					<Spacer height={"20px"} />
					<TextField
						placeholder="User ID"
						label="User ID"
						type="text"
						onChange={(e: any) => handleStudentId(e.target.value, "reg")}
					/>
					<Spacer height={"20px"} />
					<FormLabel>Select Group</FormLabel>
					<Select
						placeholder="Select Group"
						height={"50px"}
						onChange={(e) => handleStudentId(e.target.value, "group")}
					>
						{allGroup?.data?.map((group: any) => (
							<option value={group._id}>{group.group}</option>
						))}
					</Select>
					<Spacer height={"20px"} />
					<TextField
						placeholder="Password"
						label="Password"
						type="password"
						onChange={(e: any) => handleStudentId(e.target.value, "password")}
					/>
					<Spacer height={"20px"} />

					<Button
						width="full"
						onClick={(e) => handleStudentLogin(e)}
						// disabled={Object.values(student).some(
						// 	(n: any) => n.trim()?.length === 0
						// )}
						background={"purple.500"}
						color="white"
						height="60px"
					>
						Continue
					</Button>
					<Spacer height={"20px"} />

					<Text>
						Forgot Password?{" "}
						<Link href="/forgot-password">
							<span
								style={{
									fontWeight: 500,
									cursor: "pointer",
									textDecoration: "underline",
									color: "blue",
								}}
							>
								Click here
							</span>
						</Link>
					</Text>
				</div>
				<Image
					width={"50%"}
					src="https://res.cloudinary.com/dla0k5ne6/image/upload/v1622073568/beam-app-frontend-media-assets/sign-in_hazcqh.png"
				/>
			</section>
		</div>
	);
};

export default UserLogin;
