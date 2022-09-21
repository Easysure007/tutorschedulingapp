import {
	Table,
	Thead,
	Tbody,
	Modal,
	Box,
	ModalOverlay,
	ModalContent,
	Select,
	Text,
	Tabs,
	TabPanel,
	Tab,
	TabPanels,
	TabList,
	Stack,
	ModalBody,
	ModalCloseButton,
	FormLabel,
	useDisclosure,
	Tr,
	Button,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";

export default function ManageBookings() {
	const { isOpen, onOpen, onClose } = useDisclosure();
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
						Manage Bookings
					</Text>
				</Box>
				<Tabs variant="enclosed">
					<TabList>
						<Tab>Pending Booking</Tab>
						<Tab>Accepted Booking</Tab>
						<Tab>Declined Booking</Tab>
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
											<Th>Full name</Th>
											<Th>Action</Th>
										</Tr>
									</Thead>
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
											<Th>ID</Th>
											<Th>Full name</Th>
											<Th>Action</Th>
										</Tr>
									</Thead>
								</Table>
							</TableContainer>
						</TabPanel>
					</TabPanels>
				</Tabs>

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalCloseButton />
						<ModalBody>
							<Box
								display={"flex"}
								flexDir="column"
								justifyContent={"center"}
								alignItems="center"
							>
								<Stack mx="10">
									<Text
										fontWeight={800}
										className=""
										fontSize="20px"
										color="#101827"
									>
										Select a date
									</Text>
								</Stack>
								<Stack mx={10} my={5} maxHeight="350px" overflow={"auto"}>
									<div className="">
										{/* <Select
												onChange={(e) => setGetAvailabilityID(e.target.value)}
											>
												{availability?.map((item: any) => (
													<option value={item?._id}>
														{dayjs(item.availabilityDate).format(
															"DD MMMM,  YYYY, HH:mm"
														)}
													</option>
												))}
											</Select> */}

										{/* <FormLabel>Select Group</FormLabel> */}
										{/* <Select onChange={(e) => setGroupId(e.target.value)}>
												{allGroup?.data?.map((item: any) => (
													<option value={item?._id}>{item.group}</option>
												))}
											</Select> */}
									</div>
								</Stack>
								{/* <Button
										colorScheme="blue"
										mr={3}
										my={10}
										onClick={() => createSchedules()}
									>
										Proceed
									</Button> */}
							</Box>
						</ModalBody>
					</ModalContent>
				</Modal>
			</Box>
		</div>
	);
}
