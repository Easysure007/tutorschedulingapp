import { useStudentHook } from "../students/students.hook";
import { useCordinatorHook } from "./coordinator-hook";
import { useState } from "react";
import { IProps } from "../students/students-page";
import { TextField } from "../../../UI/TextField/textfield";
import {
	Table,
	Thead,
	Tbody,
	Modal,
	Menu,
	Text,
	Box,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	Spacer,
	ModalFooter,
	ModalBody,
	Flex,
	Spinner,
	ModalCloseButton,
	useDisclosure,
	Tr,
	Button,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";

export const CoordinatorPage = ({ searchValue }: IProps) => {
	const {
		disabled,
		handleCreateStudentData,
		handleSubmit,
		createStudentData,
		setCreateStudentData,
	} = useStudentHook();

	const { allCordinators, loading } = useCordinatorHook();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editable, setEditable] = useState(false);
	const [deleteUser, setDeleteUser] = useState({
		name: "",
		id: "",
	});

	return (
		<Box
			borderLeft="1px solid #ededf2"
			borderRight="1px solid #ededf2"
			borderRadius={"10px 10px 0px 0px"}
		>
			<Box
				display={"flex"}
				justifyContent={"space-between"}
				borderColor="#ededf2"
				borderWidth="1px 0px 0px 0px"
				borderRadius={"10px 10px 0px 0px"}
				padding="20px 10px"
				alignItems={"center"}
			>
				<Text fontWeight={"800"} pl="5">
					Module Co-ordinator
				</Text>
				<Menu>
					<Button
						background="purple.800"
						color="white"
						onClick={() => {
							onOpen();
							if (editable) setEditable(false);
						}}
					>
						Add Coordinator{" "}
					</Button>
				</Menu>
			</Box>

			<TableContainer
				borderColor="#ededf2"
				borderWidth="1px 0px 0px 0px"
				borderRadius={"10px 10px 0px 0px"}
				width="100%"
			>
				<Table variant="simple" size="lg">
					<Thead background={"#FAFAFA"}>
						<Tr>
							<Th>S/N</Th>
							<Th>Name</Th>
							<Th>Email</Th>
						</Tr>
					</Thead>
					<Tbody>
						{!loading &&
							allCordinators
								?.filter((cordinator: any) =>
									cordinator.name
										.toLowerCase()
										.includes(searchValue.toLowerCase())
								)
								.map((cordinator: any, idx: any) => (
									<Tr>
										<Td>
											<Text>{idx + 1}</Text>
										</Td>
										<Td>
											<Text>{cordinator.name}</Text>
										</Td>
										<Td>
											<Text>{cordinator.email}</Text>
										</Td>
									</Tr>
								))}
					</Tbody>
				</Table>
			</TableContainer>
			{loading && (
				<>
					<Box
						display="flex"
						width="100%"
						my="30"
						borderBottom={"1px solid #ededf2"}
						py={10}
						justifyContent={"center"}
						alignItems="center"
					>
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
					</Box>
				</>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Coordinator</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TextField
							label="Coordinator's Email"
							type="text"
							placeholder="E.g ray@school.com"
							onChange={(e) => handleCreateStudentData("email", e.target.value)}
						/>
						<Spacer height="20px" />
						<TextField
							label="Coordinator's Full Name"
							type="text"
							placeholder="E.g Ray King"
							onChange={(e) => handleCreateStudentData("name", e.target.value)}
						/>
						<Spacer height="20px" />

						<TextField
							placeholder="Password"
							label="Password"
							type="password"
							onChange={(e) =>
								handleCreateStudentData("password", e.target.value)
							}
						/>
						<Spacer height={"20px"} />
						<TextField
							label="Password Confirmation"
							placeholder="Email Address"
							type="password"
							onChange={(e) =>
								handleCreateStudentData("passwordConfirmation", e.target.value)
							}
						/>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							colorScheme={"purple"}
							disabled={disabled}
							onClick={(e: any) => {
								handleSubmit(e, "admin");
								onClose();
							}}
						>
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
