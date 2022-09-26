import { useStudentBookingHook } from "./student-booking-hook";
import Kalend from "kalend";
import dayjs from "dayjs";
import { Search2Icon } from "@chakra-ui/icons";
import { CalendarView } from "kalend";
import { useTutorHook } from "../users/tutors/tutors-hook";
import {
	Table,
	Thead,
	Tbody,
	Modal,
	Box,
	ModalOverlay,
	Td,
	Input,
	InputGroup,
	InputLeftAddon,
	Flex,
	Button,
	ModalContent,
	Spinner,
	Text,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Tr,
	Th,
	TableContainer,
} from "@chakra-ui/react";

export default function StudentBooking() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { allInstructors, loading } = useTutorHook();
	const {
		getTutorAvail,
		loading: availLoading,
		getTutorAvailability,
		availabilityId,
		searchValue,
		setSearchValue,
		setAvailabilityID,
		handleCreateSchedule,
	} = useStudentBookingHook();

	// CREATES A MAP OF ALL THE INSTRUCTORS AVAILABILITY SO IT CAN BE USED ON THE CALENDER

	const InstructorEvents = getTutorAvail?.map((item: any, idx: any) => {
		return {
			id: item._id,
			startAt: item.availabilityDate,
			endAt: item.endDate,
			timezoneStartAt: "Europe/Berlin",
			timezoneEndAt: "Europe/Berlin",
			summary: `${dayjs(item.availabilityDate).format("HH:mm")}  - ${dayjs(
				item.endDate
			).format("HH:mm")} `,
			color: "purple",
			calendarID: "work",
		};
	});
	// TRIGGERS WHEN A UNOCCUPIED DATE IS CLICKED ON THE CALENDER

	const onEventClick = (data: any) => {
		// SETS A NEW AVAILABILITY FOR THE TUTOR

		setAvailabilityID(data.id);
	};
	return (
		<div style={{ width: "100%" }}>
			<Box
				borderLeft="1px solid #ededf2"
				borderRight="1px solid #ededf2"
				width="100%"
				borderRadius={"10px 10px 0px 0px"}
			>
				<Box
					display={"flex"}
					justifyContent={"space-between"}
					borderColor="#ededf2"
					width="100%"
					borderWidth="1px 0px 0px 0px"
					borderRadius={"10px 10px 0px 0px"}
					padding="20px 10px"
					alignItems={"center"}
				>
					<Text fontWeight={"800"} pl="5">
						Manage your Bookings
					</Text>
					<InputGroup width="30%">
						<InputLeftAddon
							children={
								<>
									<Search2Icon />
								</>
							}
						/>
						<Input
							value={searchValue}
							placeholder="Search tutor by name"
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</InputGroup>
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
								<Th>Tutor</Th>

								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
							{allInstructors?.data
								?.filter((instructor: any) =>
									instructor.name
										?.toLowerCase()
										?.includes(searchValue?.toLowerCase())
								)
								.map((instructor: any, idx: any) => (
									<Tr>
										<Td>
											<Text fontSize="14px">{idx + 1}</Text>
										</Td>
										<Td>
											{" "}
											<Text fontSize="14px">
												{" "}
												{instructor?.isAnonymous === true
													? "Available Tutor"
													: instructor.name}{" "}
											</Text>
										</Td>

										<Td>
											<Flex>
												<Button
													background="white"
													color="#585afb"
													textDecoration={"underline"}
													fontSize="13px"
													onClick={() => {
														onOpen();
														getTutorAvailability(instructor._id);
													}}
												>
													Book Tutor
												</Button>
											</Flex>
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
											onEventClick={onEventClick}
										/>
										<Button
											colorScheme="blue"
											mr={3}
											my={10}
											isDisabled={availabilityId?.trim()?.length === 0}
											onClick={() => {
												handleCreateSchedule();
												onClose();
											}}
										>
											Book tutor
										</Button>
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
			</Box>
		</div>
	);
}
