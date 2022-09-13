import { Stack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useGroupHook } from "./group.hook";
import { useEffect } from "react";
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
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
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
							{allGroup?.data
								?.filter((grp: any) =>
									grp.group.toLowerCase().includes(searchValue.toLowerCase())
								)
								.map((group: any, idx: any) => (
									<Groups group={group} key={idx} />
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
								<Spinner />
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
							{loading ? <Spinner /> : "Submit"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const Groups = ({ group }: any) => {
	const { group: students, viewGroup, loading } = useGroupHook();
	return (
		<Accordion width="100%">
			<AccordionItem>
				<h2>
					<AccordionButton onClick={() => viewGroup(group._id)}>
						<Box flex="1" textAlign="left" fontWeight={800}>
							{group.group}
						</Box>
						<AccordionIcon />
					</AccordionButton>
				</h2>
				<AccordionPanel pb={4}>
					<Box display={"flex"} alignItems="center" justifyContent={"center"}>
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
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};
