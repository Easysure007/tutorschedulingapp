import {
	Flex,
	Box,
	Text,
	Textarea,
	FormLabel,
	Spacer,
	Button,
} from "@chakra-ui/react";
import { TextField } from "../../UI/TextField/textfield";

export const SettingsPage = () => {
	return (
		<Box
			width={"100%"}
			p="10"
			borderRadius={"10px"}
			border="1px solid #ededf2"
			mt="10"
		>
			<Text fontWeight="800">Update Course Information</Text>
			<Flex my="5" width="100%" justifyContent={"space-between"}>
				<Box width="40%">
					<TextField
						label="Course Code"
						type="text"
						placeholder="E.g PHE200"
						onChange={() => null}
					/>
					<Spacer height="10" />
					<TextField
						label="Course Title"
						type="text"
						placeholder="E.g Human physiology"
						onChange={() => null}
					/>
				</Box>
				<Box width="40%">
					<FormLabel>Course Description</FormLabel>
					<Textarea
						placeholder="E.g Human physiology"
						onChange={() => null}
						rows={10}
						resize="none"
					/>
				</Box>
			</Flex>
			<Flex alignItems={"center"} justifyContent="center" mt="10">
				<Button width="50%" height="50px">
					Submit
				</Button>
			</Flex>
		</Box>
	);
};
