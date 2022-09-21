import { Stack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useGroupHook } from "./group.hook";
import { useEffect, useState, useCallback } from "react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { getGroup } from "./group.requests";
import { IProps } from "../students/students-page";
import { TextField } from "../../../UI/TextField/textfield";
import {
	Table,
	Tbody,
	Box,
	Button,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	Flex,
	ModalFooter,
	ModalBody,
	Modal,
	ModalCloseButton,
	Spinner,
	useDisclosure,
	TableContainer,
} from "@chakra-ui/react";

export const GroupPage = ({ searchValue }: IProps) => {
	const {
		allGroup,
		handleGroupName,
		loading,
		success,
		setSuccess,
		deleteGroup,
		createGroup,
		handleCreateGroup,
	} = useGroupHook();

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		if (success) {
			onClose();
			setSuccess(false);
		}
	}, [success]);

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
					Existing Groups
				</Text>

				<Button background="purple.600" color="white" onClick={onOpen}>
					Add Group{" "}
				</Button>
			</Box>
			<Stack>
				<TableContainer border={"1px solid #ededf2"} width="100%">
					<Table variant="simple" size="lg">
						<Tbody>
							{!loading &&
								allGroup
									?.filter(
										(grp: any) =>
											grp.group
												.toLowerCase()
												.includes(searchValue.toLowerCase()) &&
											grp?.status !== "inactive"
									)
									.map((group: any, idx: any) => (
										<Groups group={group} key={idx} deleteGroup={deleteGroup} />
									))}
						</Tbody>
					</Table>
					{loading && (
						<>
							<Box
								display="flex"
								width="100%"
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
				</TableContainer>
			</Stack>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Group</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TextField
							label="Group Name"
							type="text"
							placeholder="E.g Chemistry group"
							onChange={(e) => handleGroupName(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme={"purple"}
							isLoading={loading}
							onClick={() => handleCreateGroup()}
							disabled={createGroup.trim().length === 0}
						>
							{loading ? (
								<Spinner
									thickness="4px"
									speed="0.65s"
									emptyColor="gray.200"
									color="blue.500"
									size="sm"
								/>
							) : (
								"Submit"
							)}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const Groups = ({ group, deleteGroup }: any) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [students, setGroup] = useState([]);

	const viewGroup = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const res: any = await getGroup(id, true);
			setGroup(res.data.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}, []);
	// const deleteGroup = useCallback(async (id: string) => {
	// 	setLoading(true);
	// 	try {
	// 		setLoading(false);
	// 	} catch {
	// 		setLoading(false);
	// 	}
	// }, []);

	return (
		<Box
			width="100%"
			padding="8px"
			borderBottom="1px solid #ededf2"
			cursor="pointer"
		>
			<Box>
				<h2>
					<Box display="flex" justifyContent="space-between">
						<Box flex="1" textAlign="left" fontWeight={800}>
							{group.group}
						</Box>
						<Box display="flex" alignItems="center">
							<Text
								fontSize="12px"
								color="red.800"
								onClick={() => deleteGroup(group._id)}
								fontWeight={600}
								mr="5"
								textDecoration="underline"
							>
								Delete Group
							</Text>
							<div
								onClick={() => {
									viewGroup(group._id);
									setOpen(!open);
								}}
							>
								<ArrowUpDownIcon color={"purple.800"} fontSize="12px" />
							</div>
						</Box>
					</Box>
				</h2>
				{open && (
					<Box py={4}>
						<Box display={"flex"} justifyContent={"space-between"}>
							{!loading && students?.length > 0 ? (
								students?.map((student: any) => (
									<Box>
										<Flex>
											Name:
											<Box ml={10}>{student.name}</Box>
										</Flex>
									</Box>
								))
							) : loading ? (
								<Spinner />
							) : (
								<div>No student found</div>
							)}
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};
