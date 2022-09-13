import { useStudentHook } from "./students.hook";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import { TextField } from "../../../UI/TextField/textfield";
import {
	Table,
	Thead,
	Tbody,
	Modal,
	Text,
	Box,
	ModalOverlay,
	ModalContent,
	Select,
	ModalHeader,
	Spacer,
	ModalFooter,
	Tabs,
	TabList,
	Input,
	TabPanels,
	Tab,
	TabPanel,
	ModalBody,
	Flex,
	Spinner,
	ModalCloseButton,
	FormLabel,
	useDisclosure,
	Tr,
	Button,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";
import { useGroupHook } from "../groups/group.hook";

export interface IProps {
	searchValue: string;
}
export const StudentPage = ({ searchValue }: IProps) => {
	const {
		allStudents,
		disabled,
		handleCreateStudentData,
		loading,
		handleSubmit,
		deactivateUser,
		handleUploadStudents,
		uploadedFile,
		setUploadedFile,
		editStudent,
		createStudentData,
		updateUser,
		setCreateStudentData,
	} = useStudentHook();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editable, setEditable] = useState(false);
	const [editUserId, setEditUserId] = useState("");

	const [deleteUser, setDeleteUser] = useState({
		name: "",
		id: "",
	});
	const { allGroup } = useGroupHook();
	const {
		isOpen: isCordinatorOpen,
		onOpen: onCordinatorOpen,
		onClose: onCordinatorClose,
	} = useDisclosure();
	const {
		isOpen: uploadIsOpen,
		onOpen: uploadOnOpen,
		onClose: uploadClose,
	} = useDisclosure();
	console.log(uploadedFile);
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
					Existing Students
				</Text>
				<Flex>
					<Button
						background="purple.800"
						color="white"
						onClick={() => {
							onOpen();
							if (editable) setEditable(false);
						}}
					>
						Add Student{" "}
					</Button>
					<Spacer width="5px" />

					<Button
						borderColor="purple.800"
						borderWidth="1px"
						color="purple.800"
						variant={"outline"}
						onClick={() => {
							uploadOnOpen();
						}}
					>
						Upload Students
					</Button>
				</Flex>
			</Box>
			<Tabs variant="enclosed">
				<TabList>
					<Tab width="30%" height="20%">
						Active
					</Tab>
					<Tab width="30%">Deactivated</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<TableContainer
							borderColor="#ededf2"
							borderWidth="1px 0px 0px 0px"
							borderRadius={"10px 10px 0px 0px"}
							width="100%"
						>
							<Table variant="simple" size="lg">
								<Thead background={"#FAFAFA"}>
									<Tr>
										<Th>ID</Th>
										<Th>Name</Th>
										<Th>Email</Th>
										<Th>Group</Th>
										<Th>Action</Th>
									</Tr>
								</Thead>
								<Tbody>
									{!loading &&
										allStudents?.data
											?.filter(
												(student: any) =>
													student.name
														.toLowerCase()
														.includes(searchValue.toLowerCase()) &&
													student?.status?.toLowerCase() !== "inactive"
											)
											?.map((student: any) => (
												<Tr>
													<Td>
														<Text>{student.registrationNumber}</Text>
													</Td>
													<Td>
														<Text>{student.name}</Text>
													</Td>
													<Td>
														<Text>{student.email}</Text>
													</Td>
													<Td>
														<Text>
															{allGroup?.data
																?.filter(
																	(item: any) => item._id === student.groupId
																)
																.map((item: any) => item.group)}
														</Text>
													</Td>
													<Td>
														<Flex>
															<Button
																background="white"
																textDecoration={"underline"}
																color="blue.600"
																fontWeight={400}
																onClick={() => {
																	onOpen();
																	setEditable(true);
																	setEditUserId(student._id);
																	setCreateStudentData({
																		name: student.name,
																		email: student.email,
																		registrationNumber:
																			student.registrationNumber,
																		groupId: student.groupId,
																		password: "",
																		passwordConfirmation: "",
																	});
																}}
															>
																Edit
															</Button>
															<Button
																background="white"
																textDecoration={"underline"}
																color="red.500"
																fontWeight={400}
																onClick={() => {
																	onCordinatorOpen();
																	setDeleteUser({
																		name: student.name,
																		id: student._id,
																	});
																}}
															>
																Deactivate
															</Button>
														</Flex>
													</Td>
												</Tr>
											))}
								</Tbody>
							</Table>
						</TableContainer>
					</TabPanel>
					<TabPanel>
						<TableContainer
							borderColor="#ededf2"
							borderWidth="1px 0px 0px 0px"
							borderRadius={"10px 10px 0px 0px"}
							width="100%"
						>
							<Table variant="simple" size="lg">
								<Thead background={"#FAFAFA"}>
									<Tr>
										<Th>Name</Th>
										<Th>Email</Th>
									</Tr>
								</Thead>
								<Tbody>
									{!loading &&
										allStudents?.data
											?.filter(
												(student: any) =>
													student.name
														.toLowerCase()
														.includes(searchValue.toLowerCase()) &&
													student?.status?.toLowerCase() === "inactive"
											)
											?.map((student: any) => (
												<Tr>
													<Td>
														<Text fontSize="14px">{student.name}</Text>
													</Td>
													<Td>
														<Text fontSize="14px">{student.email}</Text>
													</Td>
												</Tr>
											))}
								</Tbody>
							</Table>
						</TableContainer>
					</TabPanel>
				</TabPanels>
			</Tabs>
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
					<ModalHeader>{editable ? "Edit" : "Add"} Student</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<>
							<TextField
								label="Student's ID"
								type="text"
								value={createStudentData.registrationNumber}
								placeholder="E.g RG3001"
								onChange={(e) =>
									handleCreateStudentData("registrationNumber", e.target.value)
								}
							/>
							<Spacer height="20px" />

							<TextField
								label="Student's Email"
								type="text"
								value={createStudentData.email}
								placeholder="E.g student@gmail.com"
								onChange={(e) =>
									handleCreateStudentData("email", e.target.value)
								}
							/>
							<Spacer height="20px" />
							<TextField
								label="Student's Full Name"
								type="text"
								value={createStudentData.name}
								placeholder="E.g Ray King"
								onChange={(e) =>
									handleCreateStudentData("name", e.target.value)
								}
							/>
							{!editable && (
								<>
									<Spacer height="20px" />
									<TextField
										label="Student's Password"
										type="password"
										value={createStudentData.password}
										placeholder="Password"
										onChange={(e) =>
											handleCreateStudentData("password", e.target.value)
										}
									/>
									<Spacer height="20px" />
									<TextField
										label="Student's Password Confirmation"
										type="password"
										value={createStudentData.passwordConfirmation}
										placeholder="Password"
										onChange={(e) =>
											handleCreateStudentData(
												"passwordConfirmation",
												e.target.value
											)
										}
									/>
								</>
							)}
							<Spacer height="20px" />
						</>

						<FormLabel>
							{editable ? "Change" : "Select"} student's group
						</FormLabel>
						<Select
							placeholder="Select group"
							value={createStudentData.groupId}
							onChange={(e: any) =>
								handleCreateStudentData("group", e.target.value)
							}
						>
							{allGroup?.data?.map((grp: any) => (
								<option value={grp?._id}>{grp.group}</option>
							))}
						</Select>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							colorScheme={"purple"}
							disabled={
								createStudentData.registrationNumber?.trim() === "" ||
								createStudentData.email?.trim() === "" ||
								createStudentData.name?.trim() === "" ||
								createStudentData.groupId?.trim() === "" ||
								createStudentData.password?.trim() === "" ||
								createStudentData.passwordConfirmation?.trim() === ""
							}
							onClick={(e: any) => {
								if (editable) {
									editStudent(
										{
											registrationNumber: createStudentData.registrationNumber,
											email: createStudentData.email,
											name: createStudentData.name,
											groupId: createStudentData.groupId,
										},
										editUserId
									);
								} else {
									handleSubmit(e, "user");
								}

								onClose();
							}}
						>
							{editable ? "Save changes" : "Submit"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={isCordinatorOpen} onClose={onCordinatorClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Deactivate Student</ModalHeader>
					<ModalBody>
						<Text>
							Are you sure you want to deactivate{"  "}
							<span style={{ fontWeight: "bold" }}>{deleteUser.name}</span> ?
						</Text>
						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={onCordinatorClose}>
								Close
							</Button>
							<Button
								colorScheme={"blue"}
								disabled={disabled}
								onClick={(e: any) => {
									onCordinatorClose();
									deactivateUser(deleteUser.id, "inactive");
								}}
							>
								Deactivate
							</Button>
						</ModalFooter>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Modal isOpen={uploadIsOpen} onClose={uploadClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Bulk Upload</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text mb="2" fontSize="13px">
							Click below to upload students
						</Text>
						<Text mb="2" fontSize="13px">
							File must be a CSV file
						</Text>

						<Box
							border="1px solid #ededf2"
							borderRadius={"10px"}
							height="200px"
							display={"flex"}
							flexDirection="column"
							position="relative"
							justifyContent="center"
							alignItems="center"
							width="100%"
						>
							<Input
								type="file"
								onChange={(e: any) => setUploadedFile(e?.target?.files[0])}
								style={{
									height: "100%",
									cursor: "pointer",
									width: "100%",
									opacity: "0",
									position: "absolute",
									border: "1px solid gray",
								}}
							/>
							<FiUpload size={"50px"} color="#cecede" />
							<Text color="gray.500" mt="3">
								Upload xlsx document
							</Text>
							{uploadedFile && <Text>{uploadedFile?.name}</Text>}
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							variant={"outline"}
							mr={3}
							onClick={onClose}
						>
							<a href="/students.csv" download={"/download.csv"}>
								Download Template
							</a>
						</Button>
						<Button
							background={"purple.800"}
							color="white"
							disabled={!uploadedFile?.name}
							onClick={(e: any) => handleUploadStudents()}
						>
							Upload
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
