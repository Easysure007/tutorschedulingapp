import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";
import { useBookHook } from "./book.hook";
import { useTutorHook } from "../users/tutors/tutors-hook";
import Calendar from "react-calendar";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";
import "kalend/dist/styles/index.css";
import { Stack } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	useDisclosure,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import "react-calendar/dist/Calendar.css";
import { Text } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";

export default function Book({ auth }: any) {
	const [value, onChange] = useState(new Date());
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { setSelectedInstructor, makeSchedule, availability } = useBookHook();
	const { allInstructors } = useTutorHook();
	const [selectedTutor, setSelectedTutor] = useState("");
	const [showTime, setShowTime] = useState(false);

	const router = useRouter();
	const onClickDay = () => {
		setShowTime(true);
	};

	return (
		<>
			<Flex className="mt-5">
				<Flex
					flexDir="column"
					style={{
						marginTop: "10px",
						width: "100%",
						border: "1px solid #E1E1E1",
						borderRadius: "10px",
						padding: "10px 16px",
					}}
				>
					<Text fontWeight={800} color="#101827">
						Select Tutor
					</Text>
					<Flex flexDir={"column"} mt="5" justifyContent="center">
						<TableContainer border={"1px solid #ededf2"} width="60%">
							<Table variant="simple" size="md">
								<Thead>
									<Tr>
										<Th>Tutor's name</Th>
										<Th>Course Title</Th>
									</Tr>
								</Thead>
								<Tbody>
									{allInstructors?.data?.map((item: any) => (
										<Tr
											onClick={() => {
												setSelectedInstructor(item);
												setSelectedTutor(item._id);
												makeSchedule(item?._id);
											}}
											cursor="pointer"
											background={selectedTutor === item._id ? "#E4EAF0" : ""}
										>
											<Td>{item.name}</Td>
											<Td>{item.email}</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
						<Button width="xs" mt="5" ml="5" onClick={onOpen}>
							Continue
						</Button>
					</Flex>
					<div
						style={{
							width: "100%",
							height: "0.1%",
							display: "flex",
							background: "#E1E1E1",
							margin: "15px 10px",
						}}
					></div>
				</Flex>
			</Flex>
		</>
	);
}
