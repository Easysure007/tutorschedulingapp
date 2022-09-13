import { useStoreContext } from "../../../../pages/_app";
import { TextField } from "../../../UI/TextField/textfield";
import { useTutorHook } from "./tutors-hook";
import Kalend from "kalend";
import { CalendarView } from "kalend";
import { useStudentBookingHook } from "../../student/student-booking-hook";
import { useStudentHook } from "../students/students.hook";
import { useGroupHook } from "../groups/group.hook";
import { useBookHook } from "../../book-tutor/book.hook";
import { IProps } from "../students/students-page";
import {
	Table,
	Thead,
	Tbody,
	Modal,
	Box,
	ModalOverlay,
	ModalContent,
	Spinner,
	Text,
	ModalBody,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	ModalCloseButton,
	ModalFooter,
	Spacer,
	ModalHeader,
	useDisclosure,
	Flex,
	Tr,
	Button,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";

export const TutorPage = ({ searchValue }: IProps) => {
	const { allInstructors, loading, deactivateInstructor, editTutor } =
		useTutorHook();

	const {
		getTutorAvail,
		loading: availLoading,
		getTutorAvailability,
		availabilityId,
		setAvailabilityID,
		handleCreateSchedule,
	} = useStudentBookingHook();

	const {
		isOpen: isCordinatorOpen,
		onOpen: onCordinatorOpen,
		onClose: onCordinatorClose,
	} = useDisclosure();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const { handleCreateStudentData, handleSubmit, disabled } = useStudentHook();

	const { allGroup } = useGroupHook();

	const { setSelectedInstructor, availability } = useBookHook();

	const InstructorEvents = getTutorAvail?.map((item: any, idx: any) => {
		return {
			id: item._id,
			startAt: item.availabilityDate,
			endAt: item.endDate,
			timezoneStartAt: "Europe/Berlin",
			timezoneEndAt: "Europe/Berlin",
			summary: "",
			color: "purple",
			calendarID: "work",
		};
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
					Existing Tutors
				</Text>

				<Button
					background="purple.600"
					color="white"
					onClick={onCordinatorOpen}
				>
					Add Instructor{" "}
				</Button>
			</Box>

			<Tabs variant="enclosed">
				<TabList>
					<Tab width="30%">Active</Tab>
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
										<Th>S/N</Th>
										<Th>Full name</Th>
										<Th>Email</Th>
										<Th>Action</Th>
									</Tr>
								</Thead>
								<Tbody>
									{!loading &&
										allInstructors?.data
											?.filter(
												(instructor: any) =>
													instructor.name
														.toLowerCase()
														.includes(searchValue.toLowerCase()) &&
													instructor?.status?.toLowerCase() !== "inactive"
											)
											.map((instructor: any, idx: any) => (
												<Tr>
													<Td>
														<Text>{idx + 1}</Text>
													</Td>
													<Td>
														{" "}
														<Text> {instructor.name} </Text>
													</Td>
													<Td>
														<Text> {instructor.email} </Text>
													</Td>
													<Td>
														<Flex>
															<Button
																background="white"
																color="#585afb"
																textDecoration={"underline"}
																onClick={() => {
																	onOpen();
																	getTutorAvailability(instructor._id);
																	setSelectedInstructor(instructor);
																}}
															>
																View Tutor
															</Button>
															<Button
																background="white"
																textDecoration={"underline"}
																color="red.500"
																fontWeight={400}
																onClick={() => {
																	deactivateInstructor(
																		instructor._id,
																		"inactive"
																	);
																}}
															>
																Disable Tutor
															</Button>
															{instructor?.isAnonymous === null ||
															instructor?.isAnonymous === false ? (
																<Button
																	background="white"
																	color="#585afb"
																	textDecoration={"underline"}
																	onClick={() => {
																		editTutor(
																			{ isAnonymous: true },
																			instructor._id
																		);
																	}}
																>
																	Make Anonymous
																</Button>
															) : (
																<Button
																	background="white"
																	color="#585afb"
																	textDecoration={"underline"}
																	onClick={() => {
																		editTutor(
																			{ isAnonymous: false },
																			instructor._id
																		);
																	}}
																>
																	Make Tutor Visible
																</Button>
															)}
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
										<Th>S/N</Th>
										<Th>Full name</Th>
										<Th>Email</Th>
									</Tr>
								</Thead>
								<Tbody>
									{allInstructors?.data
										?.filter(
											(instructor: any) =>
												instructor.name
													.toLowerCase()
													.includes(searchValue.toLowerCase()) &&
												instructor?.status?.toLowerCase() === "inactive"
										)
										.map((instructor: any, idx: any) => (
											<Tr>
												<Td>
													<Text>{idx + 1}</Text>
												</Td>
												<Td>
													{" "}
													<Text> {instructor.name} </Text>
												</Td>
												<Td>
													<Text> {instructor.email} </Text>
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
			<Modal isOpen={isOpen} onClose={onClose} size="3xl">
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Box
							display={"flex"}
							flexDir="column"
							justifyContent={"center"}
							width="100%"
							height="500px"
							alignItems="center"
						>
							{!availLoading && getTutorAvail?.length > 0 ? (
								<>
									<Kalend
										selectedView={CalendarView.WEEK}
										showWeekNumbers={true}
										disabledDragging={true}
										events={InstructorEvents}
									/>
								</>
							) : (
								!availLoading && (
									<Box>
										<Text>This tutor has no availability, yet!</Text>
									</Box>
								)
							)}
							{availLoading && (
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
							)}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Modal isOpen={isCordinatorOpen} onClose={onCordinatorClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Instructor</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TextField
							label="Instructor's Email"
							type="text"
							placeholder="E.g ray@dev.com"
							onChange={(e) => handleCreateStudentData("email", e.target.value)}
						/>
						<Spacer height="20px" />
						<TextField
							label="Instructor's Full Name"
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
						<Button colorScheme="blue" mr={3} onClick={onCordinatorClose}>
							Close
						</Button>
						<Button
							colorScheme={"purple"}
							disabled={disabled}
							onClick={(e: any) => {
								handleSubmit(e, "instructor");
								onCordinatorClose();
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
