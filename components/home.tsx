import React from "react";
import { Button, Flex, Spacer, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const HomePage = () => {
	const router = useRouter();
	return (
		<div className="mainDiv">
			{" "}
			<section className="hero-section" style={{ paddingTop: "50px" }}>
				<div className="main" style={{ width: "40%" }}>
					<Text fontWeight={"800"} fontSize={"30px"}>
						Welcome to Scheduler.
					</Text>
					<Spacer height={"20px"} />
					<Text>Please tell us who you are.</Text>
					<Flex mt="20" justifyContent={"space-between"}>
						<Button
							onClick={() => router.push("/auth/student")}
							variant={"outline"}
							color="purple.200"
							borderRadius={"0px"}
							width="200px"
							height="50px"
							borderColor={"purple.200"}
						>
							Student
						</Button>
						<Button
							onClick={() => router.push("/auth/login")}
							variant={"solid"}
							background="purple.200"
							borderRadius={"0px"}
							color="white"
							ml="4"
							height="50px"
							width="300px"
						>
							Tutor/Module co-ordinator
						</Button>
					</Flex>
				</div>
				<Image
					width={"50%"}
					src="https://res.cloudinary.com/dla0k5ne6/image/upload/v1622073568/beam-app-frontend-media-assets/sign-in_hazcqh.png"
				/>
			</section>
		</div>
	);
};
