import React from "react";
import { TextField } from "../../components/UI/TextField/textfield";
import Link from "next/link";

import { Button, Stack, Spacer, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useAuthHook } from "../../components/auth/auth-hook";

const Login = () => {
	const router = useRouter();
	const { handleLogin, handleInput, disabled, loading } = useAuthHook();

	return (
		<div className="mainDiv">
			<section className="hero-section" style={{ paddingTop: "50px" }}>
				<div className="main" style={{ width: "30%" }}>
					<Text fontWeight={"800"} fontSize={"30px"}>
						Sign in to Scheduler
					</Text>
					<Spacer height={"20px"} />
					<Stack>
						<TextField
							placeholder="Email address"
							label="Email address"
							type="text"
							onChange={(e: any) => handleInput("email", e.target.value)}
						/>
					</Stack>
					<Spacer height={"20px"} />
					<Stack>
						<TextField
							onChange={(e: any) => handleInput("password", e.target.value)}
							placeholder="Enter password"
							type={"password"}
							label="Password"
						/>
					</Stack>
					<Spacer height={"20px"} />
					<Button
						onClick={(e: any) => handleLogin(e)}
						width="full"
						isLoading={loading}
						isDisabled={disabled}
						_hover={{ background: "purple.300" }}
						background={"purple.800"}
						color="white"
						height="60px"
					>
						Continue
					</Button>
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

export default Login;
