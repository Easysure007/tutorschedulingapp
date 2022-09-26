import React, { useMemo, useState } from "react";
import { GroupPage } from "./groups/group-page";
import { StudentPage } from "./students/students-page";
import { SideNavigation } from "../../UI/navigations/side_nav";
import { Search2Icon } from "@chakra-ui/icons";
import { Flex, Box, Input, InputLeftAddon, InputGroup } from "@chakra-ui/react";
import { TutorPage } from "./tutors/tutors-page";
import { useStoreContext } from "../../../pages/_app";

import { CoordinatorPage } from "./coordinator/coordinator";

export default function User({}: any) {
	const [nav, setNav] = useState({
		students: true,
		groups: false,
		cordinator: false,
		tutor: false,
	});
	const [searchValue, setSearch] = useState("");
	const {
		DataStore: { user, token },
	} = useStoreContext();

	// FUNCTION THAT HANDLES THE NAVIGATION OF PAGES ON THE APPLICATION

	const HomeNavigation = useMemo(() => {
		const navigations = [
			{
				active: nav.students,
				href: "#",
				id: "1",
				onClick: () => {
					setNav({
						students: true,
						groups: false,
						cordinator: false,
						tutor: false,
					});
					setSearch("");
				},
				title: "Students",
			},
			{
				active: nav.cordinator,
				href: "#",
				id: "1",
				onClick: () => {
					setNav({
						students: false,
						groups: false,
						cordinator: true,
						tutor: false,
					});
					setSearch("");
				},
				title: "Coordinator",
			},
			{
				active: nav.groups,
				href: "#",
				id: "2",
				onClick: () => {
					setNav({
						students: false,
						groups: true,
						cordinator: false,

						tutor: false,
					});
					setSearch("");
				},
				title: "Groups",
			},
			{
				active: nav.tutor,
				href: "#book",
				id: "3",
				onClick: () => {
					setNav({
						students: false,
						groups: false,
						cordinator: false,

						tutor: true,
					});
					setSearch("");
				},
				title: "Tutor",
			},
		];

		return navigations;
	}, [nav]);

	return (
		<Flex mt="4%">
			<SideNavigation navigations={HomeNavigation} />
			<div className="mt-5" style={{ width: "100%" }}>
				<Box mb="5">
					<InputGroup>
						<InputLeftAddon
							height="12"
							children={
								<Box>
									<Search2Icon color={"#cedede"} />
								</Box>
							}
						/>
						<Input
							height="12"
							onChange={(e: any) => setSearch(e.target.value)}
							value={searchValue}
							placeholder={`Search by ${
								nav.students
									? "students"
									: nav.tutor
									? "tutors"
									: nav.cordinator
									? "co-ordinator"
									: nav.groups && "groups"
							} name`}
						/>
					</InputGroup>
				</Box>
				{/* RENDERS A PAGE DEPENDING ON WHAT IS SELECTED BY A USER */}
				{nav.students && <StudentPage searchValue={searchValue} />}
				{nav.groups && <GroupPage searchValue={searchValue} />}
				{nav.tutor && <TutorPage searchValue={searchValue} />}
				{nav.cordinator && <CoordinatorPage searchValue={searchValue} />}
			</div>
		</Flex>
	);
}
