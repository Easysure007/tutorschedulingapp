import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ClientOnly from "../../../client";
import { Avatar } from "@chakra-ui/react";
import { EditProfile } from "./edit-profile";
import { UpdatePassword } from "./update-password";
import { useRouter } from "next/router";
import { useStoreContext } from "../../../pages/_app";
import { useState } from "react";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Modal,
	ModalCloseButton,
	ModalBody,
	ModalHeader,
	useDisclosure,
	ModalOverlay,
	ModalContent,
} from "@chakra-ui/react";

export default function Navbar() {
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [editProfile, setEditProfile] = useState(false);

	const {
		DataStore: { user },
	} = useStoreContext();
	return (
		<ClientOnly>
			<Flex py="5" px="20" justifyContent={"space-between"} alignItems="center">
				<Text fontWeight={"bold"} fontSize="20px">
					Meetings
				</Text>

				<Flex alignItems={"center"}>
					<Menu>
						<MenuButton>
							<Avatar bg="purple.900" size={"sm"} />
							<ChevronDownIcon color="#cecede" w={6} h={6} />
						</MenuButton>
						<MenuList padding={"8px "} width="40px">
							{user?.role !== "student" && (
								<MenuItem
									onClick={() => {
										if (!editProfile) setEditProfile(true);
										onOpen();
									}}
								>
									Edit profile
								</MenuItem>
							)}
							<MenuItem
								onClick={() => {
									if (editProfile) setEditProfile(false);
									onOpen();
								}}
							>
								Change Password
							</MenuItem>
							<MenuItem
								borderRadius={"10px"}
								onClick={() => {
									localStorage.clear();
									router.push("/");
								}}
							>
								Log out
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
				{/* MODAL POP UP UI TO EITHIER EDIT YOUR PROFILE OR CHANGE YOUR PASSWORD */}
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>
							{editProfile ? "Edit Profile" : "Change password "}
						</ModalHeader>
						<ModalCloseButton />

						<ModalBody>
							{editProfile ? <EditProfile /> : <UpdatePassword />}
						</ModalBody>
					</ModalContent>
				</Modal>
			</Flex>
		</ClientOnly>
	);
}
