import React, { useState } from "react";
import Kalend from "kalend";
import dayjs from "dayjs";
import { InfoIcon } from "@chakra-ui/icons";
import { useAvailability } from "./availability-hook";
import { CalendarView } from "kalend";
import { TextField } from "../../UI/TextField/textfield";
import {
	Box,
	Text,
	Tooltip,
	Modal,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Button,
	Spinner,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";

export default function ViewAvailability() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: deleteOpen,
		onOpen: deleteOnOpen,
		onClose: onDeleteClose,
	} = useDisclosure();
	const {
		dateTime,
		setDateTime,
		duration,
		deleteAvailability,
		getTutorAvail,
		deleteAvail,
		setDeleteAvail,
		setDuration,
		submitLoading,
		handleCreateAvailability,
	} = useAvailability();

	const onNewEventClick = (data: any) => {
		setDateTime({
			date: data.startAt,
			time: dayjs(data.startAt).format("HH:mm"),
		});
		onOpen();
	};
	console.log(deleteAvail);
	const onEventClick = (data: any) => {
		console.log(data);
		deleteOnOpen();
		setDeleteAvail({
			name: data.startAt,
			id: data.id,
		});
	};

	const InstructorEvents = getTutorAvail?.map((item: any, idx: any) => {
		return {
			id: item._id,
			startAt: item.availabilityDate,
			endAt: item.endDate,
			timezoneStartAt: "Europe/Berlin",
			timezoneEndAt: "Europe/Berlin",
			summary: "Date booked",
			color: "blue",
			calendarID: "work",
		};
	});

	return (
		<div style={{ height: "100%" }}>
			<Text fontWeight={800} my={4}>
				View Your Availability{" "}
				<span style={{ marginLeft: "15px" }}>
					<Tooltip label="Select a empty time slot to provide your availability">
						<InfoIcon color="blue.400" />
					</Tooltip>
				</span>
			</Text>
			<Text fontSize={"12px"} mb="3">
				Note: Select a empty time slot to provide your availability
			</Text>
			<Box height="500px" border={"1px solid #ededf2"} borderRadius="10px">
				<Kalend
					selectedView={CalendarView.WEEK}
					showWeekNumbers={true}
					disabledDragging={true}
					onEventClick={onEventClick}
					events={InstructorEvents}
					onNewEventClick={onNewEventClick}
				/>
			</Box>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create Availability</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize="14px">
							You're about to provide your availability for{" "}
							<span style={{ fontWeight: 800 }}>
								{dayjs(dateTime.date).format("dddd, DD MMMM YYYY")}
							</span>
							,{" "}
							<span style={{ fontWeight: 800 }}>
								{dayjs(dateTime.date).format("hh:mm a")}
							</span>
							.<br />
							To Continue, please provide the duration for your availability
						</Text>
						<Spacer height="20px" />

						<TextField
							label="Set Duration (in minutes)"
							type="number"
							value={duration}
							placeholder="E.g 60"
							onChange={(e) => setDuration(e.target.value)}
						/>
						<Spacer height="20px" />
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							colorScheme={"purple"}
							isLoading={submitLoading}
							isDisabled={duration === 0 || duration === ""}
							onClick={(e: any) => {
								handleCreateAvailability();
								onClose();
							}}
						>
							{submitLoading ? (
								<Spinner color="white" thickness="3px" speed="0.65s" />
							) : (
								"Continue"
							)}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={deleteOpen} onClose={onDeleteClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Delete Availability</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize="14px">
							To Delete your availability, click confirm to continue
						</Text>

						<Spacer height="20px" />
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
							Close
						</Button>
						<Button
							colorScheme={"purple"}
							onClick={(e: any) => {
								deleteAvailability();
								onDeleteClose();
							}}
						>
							{submitLoading ? (
								<Spinner color="white" thickness="3px" speed="0.65s" />
							) : (
								"Confirm"
							)}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
