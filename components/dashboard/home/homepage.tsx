import React from "react";
import { useMemo, useState, useEffect } from "react";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	Flex,
	Textarea,
	FormLabel,
	useDisclosure,
	Badge,
	Tooltip,
	Spinner,
	Menu,
	MenuButton,
	MenuList,
	Spacer,
	MenuItem,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { InfoIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import ClientOnly from "../../../client";
import { useGroupHook } from "../users/groups/group.hook";
import { Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

import dayjs from "dayjs";
import { useScheduleHook } from "./schedule.hook";
import { Button } from "@chakra-ui/react";
import { useStoreContext } from "../../../pages/_app";
import Kalend, { CalendarView } from "kalend";

interface OnPageChangeData {
	rangeFrom: string;
	rangeTo: string;
}
interface CalendarEvent {
	startAt: string;
	endAt: string;
	timezoneStartAt?: string;
	timezoneEndAt?: string;
	summary: string;
	color: string;
	[key: string]: any;
}
interface NewEventClickData {
	event: CalendarEvent;
	day: Date;
	hour: number;
}
export default function PeopleHome({ auth }: any) {
	const [showCalend, setShowCalend] = useState(false);

	const [selectedGroup, setSelectedGroup] = useState("");
	const {
		getAllSchedule,
		handleNote,
		loading,
		setSelectedSchedule,
		selectedSchedule,
		note,
		editNote,
		setEditNote,
		getTutorSchedule,
		setNote,
		getCordinatorGroup,
		handleAcceptSchedule,
	} = useScheduleHook();
	const { allGroup } = useGroupHook();

	const {
		DataStore: { user },
	} = useStoreContext();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		onOpen: drawerOpen,
		isOpen: drawerIsOpen,
		onClose: drawerIsClose,
	} = useDisclosure();

	const router = useRouter();

	useEffect(() => {
		if (typeof window === "object") {
			setShowCalend(true);
		}
	}, []);

	const events = getAllSchedule?.map((item: any) => {
		return {
			id: item._id,
			startAt: item.availability.availabilityDate,
			endAt:
				item.availability.endDate === null
					? item.availability.availabilityDate
					: item.availability.endDate,
			timezoneStartAt: "Europe/Berlin",
			timezoneEndAt: "Europe/Berlin",
			summary: `${
				user?.role !== "student"
					? allGroup?.data?.filter((grp: any) => grp?._id === item?.groupId)[0]
							.group
					: item?.availability?.instructor?.name + "  " + "Class"
			} ${item.status?.toLowerCase() === "rejected" ? "(Rejected)" : ""}`,
			color:
				item.status?.toLowerCase() === "pending"
					? "purple"
					: item.status?.toLowerCase() === "accepted"
					? "blue"
					: item.status?.toLowerCase() === "rejected"
					? "red"
					: item.status?.toLowerCase() === "completed" && "green",
			calendarID: "work",
		};
	});

	const onPageChange = (data: OnPageChangeData) => {};

	const onEventClick = (data: CalendarEvent) => {
		setSelectedSchedule(data);

		onOpen();
	};

	useMemo(() => {
		if (router.query !== undefined) {
			const search: any = router.query;
			if (search?.makeNotes === "true") {
				onClose();
				drawerOpen();
			}
		}
	}, [router]);

	return (
		<div>
			<Box mt="5" padding={user?.role === "cordinator" ? "10px" : "5px"}>
				<ClientOnly>
					{user?.role === "cordinator" ? (
						<Box width="100%">
							<Flex alignItems={"center"} width="100%">
								<Text fontWeight={800}>View Group's Schedule</Text>
								<Spacer width="10px" />
								<Tooltip
									ml="10"
									label="Select a group from the dropdown to view the particular group's schedule"
								>
									<InfoIcon color="blue.300" />
								</Tooltip>
								<Box ml="5">
									<Menu>
										<MenuButton
											as={Button}
											border="1px solid #ededf2"
											rightIcon={<ChevronDownIcon />}
										>
											{typeof selectedGroup === "string" &&
											selectedGroup.length > 0
												? selectedGroup
												: "Select Group"}
										</MenuButton>
										<MenuList background="white">
											{allGroup?.data?.map((item: any) => (
												<MenuItem
													onClick={() => {
														setSelectedGroup(item.group);
														getCordinatorGroup(item._id);
													}}
												>
													{item.group}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</Box>
								{loading && (
									<Box ml="4">
										<Spinner
											thickness="4px"
											speed="0.65s"
											emptyColor="gray.200"
											color="blue.500"
											size="sm"
										/>
									</Box>
								)}
							</Flex>
						</Box>
					) : (
						user?.role === "instructor" && (
							<Box width="100%">
								<Flex alignItems={"center"} width="100%">
									<Text fontWeight={800}>
										View{" "}
										{typeof selectedGroup === "string" &&
										selectedGroup.length > 0
											? selectedGroup
											: "All groups"}{" "}
										Schedule
									</Text>
									<Spacer width="10px" />
									<Tooltip
										ml="10"
										label="Select a group from the dropdown to view the particular group's schedule"
									>
										<InfoIcon color="blue.300" />
									</Tooltip>
									<Box ml="5" display="flex" flexDirection={"column"}>
										<Text fontWeight={800} mb="1">
											{" "}
											Filter By:
										</Text>
										<Menu>
											<MenuButton
												as={Button}
												border="1px solid #ededf2"
												rightIcon={<ChevronDownIcon />}
											>
												{typeof selectedGroup === "string" &&
												selectedGroup.length > 0
													? selectedGroup
													: "Select Group"}
											</MenuButton>
											<MenuList background="white">
												{allGroup?.data?.map((item: any) => (
													<MenuItem
														onClick={() => {
															setSelectedGroup(item.group);
															getCordinatorGroup(item._id);
														}}
													>
														{item.group}
													</MenuItem>
												))}
											</MenuList>
										</Menu>
									</Box>
									{loading && (
										<Box ml="4">
											<Spinner
												thickness="4px"
												speed="0.65s"
												emptyColor="gray.200"
												color="blue.500"
												size="sm"
											/>
										</Box>
									)}{" "}
									{typeof selectedGroup === "string" &&
										selectedGroup.length > 0 &&
										user?.role === "instructor" && (
											<Box
												ml="4"
												cursor="pointer"
												onClick={() => {
													setSelectedGroup("");
													getTutorSchedule();
												}}
											>
												<CloseIcon w={2} h={2} />
											</Box>
										)}
								</Flex>
							</Box>
						)
					)}
				</ClientOnly>
				<Box
					mt={8}
					border=" 1px solid #E1E1E1 "
					color="white"
					borderRadius="10px"
					height={"600px"}
				>
					{showCalend && (
						<Kalend
							onEventClick={onEventClick}
							events={events}
							initialDate={new Date().toISOString()}
							hourHeight={60}
							initialView={CalendarView.MONTH}
							onPageChange={onPageChange}
						/>
					)}
				</Box>
			</Box>

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
							{getAllSchedule
								?.filter((item: any) => item._id === selectedSchedule.id)
								?.map((item: any) => (
									<>
										{user?.role === "instructor" ? (
											<>
												{item.status.toLowerCase() === "pending" ? (
													<>
														<Box>
															<Text
																mt={10}
																fontWeight={800}
																textTransform="capitalize"
															>
																{
																	allGroup?.data?.filter(
																		(grp: any) => grp?._id === item?.groupId
																	)[0].group
																}{" "}
																Pending Class
															</Text>
															{dayjs(
																item.availability.availabilityDate
															).isBefore(Date.now()) && (
																<Badge colorScheme="red">Past Due</Badge>
															)}
															<Box mt="10">
																<Text>
																	You{" "}
																	{dayjs(
																		item.availability.availabilityDate
																	).isBefore(Date.now())
																		? "had"
																		: "have"}{" "}
																	a pending class on{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("dddd, DD MMMM YYYY")}
																	</span>
																	,{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("hh:mm a")}
																	</span>{" "}
																	for{" "}
																	<span style={{ fontWeight: 800 }}>
																		{
																			allGroup?.data?.filter(
																				(grp: any) => grp?._id === item?.groupId
																			)[0].group
																		}
																	</span>
																	.
																</Text>
															</Box>
															<Flex my="5">
																<Button
																	background="purple.300"
																	color="white"
																	onClick={() => {
																		handleAcceptSchedule(item._id, "accept");
																		onClose();
																	}}
																>
																	Accept{" "}
																</Button>
																<Button
																	ml="3"
																	onClick={() => {
																		handleAcceptSchedule(item._id, "reject");
																		onClose();
																	}}
																>
																	Reject
																</Button>
															</Flex>
														</Box>
													</>
												) : item.status.toLowerCase() === "accepted" ||
												  item.status.toLowerCase() === "completed" ? (
													<>
														<Box>
															<Text
																mt={10}
																fontWeight={800}
																textTransform="capitalize"
															>
																{
																	allGroup?.data?.filter(
																		(grp: any) => grp?._id === item?.groupId
																	)[0].group
																}{" "}
																Class
															</Text>
															{item.note && (
																<Badge colorScheme="green">Completed</Badge>
															)}
															<Text my="5">
																You{" "}
																{dayjs(
																	item.availability.availabilityDate
																).isBefore(Date.now())
																	? "had"
																	: "have"}{" "}
																a class on{" "}
																<span style={{ fontWeight: 800 }}>
																	{dayjs(
																		item.availability.availabilityDate
																	).format("dddd, DD MMMM YYYY")}
																</span>
																,{" "}
																<span style={{ fontWeight: 800 }}>
																	{dayjs(
																		item.availability.availabilityDate
																	).format("hh:mm a")}
																</span>{" "}
																for{" "}
																<span style={{ fontWeight: 800 }}>
																	{
																		allGroup?.data?.filter(
																			(grp: any) => grp?._id === item?.groupId
																		)[0].group
																	}
																</span>
																.
															</Text>
															<Box my="5">
																{dayjs(
																	item.availability.availabilityDate
																).isBefore(Date.now()) && (
																	<Box>
																		{item.note && !editNote ? (
																			<Box
																				border="1px solid #ededf2"
																				borderRadius={"10px"}
																				boxShadow="xl"
																				padding="10px"
																			>
																				<Text fontWeight={800} ml="2" mb="3">
																					Note
																				</Text>
																				<Box
																					padding="10px"
																					background={"#ededf2"}
																					borderRadius="8px"
																				>
																					{item.note}
																				</Box>
																				<Box
																					display="flex"
																					mt="1"
																					justifyContent="flex-end"
																				>
																					<Text
																						mr="8"
																						fontSize="12px"
																						onClick={() => {
																							setNote(item.note);
																							setEditNote(true);
																						}}
																						cursor="pointer"
																						color="blue.400"
																						textDecoration={"underline"}
																					>
																						Edit
																					</Text>
																				</Box>
																			</Box>
																		) : (
																			<>
																				<Box>
																					<FormLabel>
																						{editNote ? "Edit" : "Write"} Note
																					</FormLabel>
																					<Textarea
																						value={note}
																						onChange={(e) =>
																							setNote(e.target.value)
																						}
																					/>
																					<Flex>
																						{editNote && (
																							<Button
																								my="5"
																								mr="3"
																								onClick={() => {
																									setEditNote(false);
																								}}
																							>
																								Cancel Edit
																							</Button>
																						)}
																						<Button
																							color="white"
																							background="blue.300"
																							my="5"
																							isDisabled={
																								note.trim().length === 0
																							}
																							onClick={() => {
																								handleNote(
																									item?._id,
																									editNote ? true : false
																								);
																								onClose();
																							}}
																						>
																							Save Note
																						</Button>
																					</Flex>
																				</Box>
																			</>
																		)}
																	</Box>
																)}
															</Box>
														</Box>
													</>
												) : (
													<></>
												)}
											</>
										) : user?.role === "student" ? (
											<>
												{item.status.toLowerCase() === "pending" ? (
													<>
														<Box>
															<Text
																mt={10}
																fontWeight={800}
																textTransform="capitalize"
															>
																{item?.availability?.instructor?.name} Pending
																Class
															</Text>
															{dayjs(
																item.availability.availabilityDate
															).isBefore(Date.now()) && (
																<Badge colorScheme="red">Past Due</Badge>
															)}
															<Box mt="10">
																<Text>
																	You{" "}
																	{dayjs(
																		item.availability.availabilityDate
																	).isBefore(Date.now())
																		? "had"
																		: "have"}{" "}
																	a pending class on{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("dddd, DD MMMM YYYY")}
																	</span>
																	,{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("hh:mm a")}
																	</span>{" "}
																	with{" "}
																	<span style={{ fontWeight: 800 }}>
																		{item?.availability?.instructor?.name}
																	</span>
																	.
																</Text>
															</Box>
														</Box>
													</>
												) : item.status.toLowerCase() === "accepted" ||
												  item.status.toLowerCase() === "completed" ? (
													<>
														<Box>
															<Text
																mt={10}
																fontWeight={800}
																textTransform="capitalize"
															>
																{item?.availability?.instructor?.name} Class
															</Text>
															{item.note && (
																<Badge colorScheme="green">Completed</Badge>
															)}
															<Text my="5">
																You{" "}
																{dayjs(
																	item.availability.availabilityDate
																).isBefore(Date.now())
																	? "had"
																	: "have"}{" "}
																a class on{" "}
																<span style={{ fontWeight: 800 }}>
																	{dayjs(
																		item.availability.availabilityDate
																	).format("dddd, DD MMMM YYYY")}
																</span>
																,{" "}
																<span style={{ fontWeight: 800 }}>
																	{dayjs(
																		item.availability.availabilityDate
																	).format("hh:mm a")}
																</span>{" "}
																with{" "}
																<span style={{ fontWeight: 800 }}>
																	{item?.availability?.instructor?.name}
																</span>
																.
															</Text>
															{item.note && (
																<Box
																	border="1px solid #ededf2"
																	borderRadius={"10px"}
																	boxShadow="xl"
																	my="3"
																	padding="10px"
																>
																	<Text fontWeight={800} ml="2" mb="3">
																		Note
																	</Text>
																	<Box
																		padding="10px"
																		background={"#ededf2"}
																		borderRadius="8px"
																	>
																		{item.note}
																	</Box>
																</Box>
															)}
														</Box>
													</>
												) : (
													<>
														<Box>
															<Text
																mt={10}
																fontWeight={800}
																textTransform="capitalize"
															>
																{item?.availability?.instructor?.name} Class
															</Text>

															<Badge colorScheme="red">Rejected</Badge>

															<Box
																border="1px solid #ededf2"
																padding="10px"
																my="3"
																borderRadius={"10px"}
															>
																<Text fontWeight={800}>Class Details</Text>
																<Text mt="3">
																	Tutor :{" "}
																	<span style={{ fontWeight: 800 }}>
																		{item?.availability?.instructor?.name}
																	</span>
																</Text>
																<div
																	style={{
																		margin: "10px 0px",
																		background: "#ededf2",
																		height: "1px",
																		width: "100%",
																	}}
																></div>
																<Text>
																	Scheduled Date :{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("dddd, DD MMMM YYYY")}
																	</span>
																	{"   "}
																</Text>
																<Text my="3">
																	Scheduled Time:{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("hh:mm a")}
																	</span>
																</Text>
															</Box>
														</Box>
													</>
												)}
											</>
										) : (
											<>
												<>
													{item.status.toLowerCase() === "pending" ? (
														<>
															<Box>
																<Text
																	mt={10}
																	fontWeight={800}
																	textTransform="capitalize"
																>
																	{
																		allGroup?.data?.filter(
																			(grp: any) => grp?._id === item?.groupId
																		)[0]?.group
																	}{" "}
																	Pending Class
																</Text>
																{dayjs(
																	item.availability.availabilityDate
																).isBefore(Date.now()) && (
																	<Badge colorScheme="red">Past Due</Badge>
																)}
																<Box mt="10">
																	<Text>
																		{
																			allGroup?.data?.filter(
																				(grp: any) => grp?._id === item?.groupId
																			)[0]?.group
																		}{" "}
																		{"   "}
																		{dayjs(
																			item.availability.availabilityDate
																		).isBefore(Date.now())
																			? "had"
																			: "have"}{" "}
																		a pending class on{" "}
																		<span style={{ fontWeight: 800 }}>
																			{dayjs(
																				item.availability.availabilityDate
																			).format("dddd, DD MMMM YYYY")}
																		</span>
																		,{" "}
																		<span style={{ fontWeight: 800 }}>
																			{dayjs(
																				item.availability.availabilityDate
																			).format("hh:mm a")}
																		</span>{" "}
																		with{" "}
																		<span style={{ fontWeight: 800 }}>
																			{item?.availability?.instructor?.name}
																		</span>
																		.
																	</Text>
																</Box>
															</Box>
														</>
													) : item.status.toLowerCase() === "accepted" ||
													  item.status.toLowerCase() === "completed" ? (
														<>
															<Box>
																<Text
																	mt={10}
																	fontWeight={800}
																	textTransform="capitalize"
																>
																	{
																		allGroup?.data?.filter(
																			(grp: any) => grp?._id === item?.groupId
																		)[0].group
																	}{" "}
																	Class
																</Text>
																{item.note && (
																	<Badge colorScheme="green">Completed</Badge>
																)}
																<Text my="5">
																	{
																		allGroup?.data?.filter(
																			(grp: any) => grp?._id === item?.groupId
																		)[0]?.group
																	}
																	{"  "}
																	{dayjs(
																		item.availability.availabilityDate
																	).isBefore(Date.now())
																		? "had"
																		: "have"}{" "}
																	a class on{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("dddd, DD MMMM YYYY")}
																	</span>
																	,{" "}
																	<span style={{ fontWeight: 800 }}>
																		{dayjs(
																			item.availability.availabilityDate
																		).format("hh:mm a")}
																	</span>{" "}
																	with{" "}
																	<span style={{ fontWeight: 800 }}>
																		{item?.availability?.instructor?.name}
																	</span>
																	.
																</Text>
																<Box my="5">
																	{dayjs(
																		item.availability.availabilityDate
																	).isBefore(Date.now()) && (
																		<Box>
																			{item.note && (
																				<Box
																					border="1px solid #ededf2"
																					borderRadius={"10px"}
																					boxShadow="xl"
																					padding="10px"
																				>
																					<Text
																						fontWeight={800}
																						fontSize="14px"
																						ml="2"
																						mb="3"
																					>
																						Note
																					</Text>
																					<Box
																						padding="10px"
																						background={"#ededf2"}
																						borderRadius="8px"
																						fontSize="14px"
																					>
																						{item.note}
																					</Box>
																				</Box>
																			)}
																		</Box>
																	)}
																</Box>
															</Box>
														</>
													) : (
														<>
															<Box>
																<Text
																	mt={10}
																	fontWeight={800}
																	textTransform="capitalize"
																>
																	{
																		allGroup?.data?.filter(
																			(grp: any) => grp?._id === item?.groupId
																		)[0]?.group
																	}{" "}
																	Class
																</Text>

																<Badge colorScheme="red">Rejected</Badge>

																<Box
																	border="1px solid #ededf2"
																	padding="10px"
																	my="3"
																	borderRadius={"10px"}
																>
																	<Text fontWeight={800}>Class Details</Text>
																	<Text mt="3">
																		Tutor :{" "}
																		<span style={{ fontWeight: 800 }}>
																			{item?.availability?.instructor?.name}
																		</span>
																	</Text>
																	<div
																		style={{
																			margin: "10px 0px",
																			background: "#ededf2",
																			height: "1px",
																			width: "100%",
																		}}
																	></div>
																	<Text>
																		Scheduled Date :{" "}
																		<span style={{ fontWeight: 800 }}>
																			{dayjs(
																				item.availability.availabilityDate
																			).format("dddd, DD MMMM YYYY")}
																		</span>
																		{"   "}
																	</Text>
																	<Text my="3">
																		Scheduled Time:{" "}
																		<span style={{ fontWeight: 800 }}>
																			{dayjs(
																				item.availability.availabilityDate
																			).format("hh:mm a")}
																		</span>
																	</Text>
																</Box>
															</Box>
														</>
													)}
												</>
											</>
										)}
									</>
								))}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
}
