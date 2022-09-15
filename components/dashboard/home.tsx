import React, { useMemo, useState, useCallback } from "react";
import { useHomeHook } from "./home-hook";
import Book from "./book-tutor/book";
import { Text } from "@chakra-ui/react";
import { useStoreContext } from "../../pages/_app";
import User from "./users/user";
import { useGroupHook } from "./users/groups/group.hook";
import Navbar from "../UI/navbar/navbar";
import InstructorPage from "./instructor";
import PeopleHome from "./home/homepage";
import StudentPage from "./student";
import ClientOnly from "../../client";
import { Navigation } from "../UI/navigations/nav";
import { SettingsPage } from "./settings/settings";

export default function HomeDashboard({ auth }: any) {
	const {
		DataStore: { user },
	} = useStoreContext();

	const [homeTabs, setHomeTabs] = useState({
		user: false,
		booking: false,
		student: false,
		home: true,
		settings: false,
		availability: false,
	});
	const { allGroup } = useGroupHook();
	const HomeNavigation = useMemo(() => {
		const navigations = [
			{
				active: homeTabs.home,
				href: "#",
				id: "1",
				onClick: () =>
					setHomeTabs({
						user: false,
						booking: false,
						availability: false,

						student: false,
						settings: false,
						home: true,
					}),
				title: "Home",
			},
		];
		if (user && user?.role === "cordinator") {
			navigations.push({
				active: homeTabs.user,
				href: "#",
				id: "2",
				onClick: () =>
					setHomeTabs({
						user: true,
						booking: false,
						student: false,
						availability: false,

						settings: false,
						home: false,
					}),
				title: "Users",
			});
		}
		if (user && user?.role === "student") {
			navigations.push({
				active: homeTabs.student,
				href: "#",
				id: "2",
				onClick: () =>
					setHomeTabs({
						user: false,
						booking: false,
						settings: false,
						availability: false,

						student: true,
						home: false,
					}),
				title: "Bookings",
			});
		}
		if (user && user?.role === "instructor") {
			navigations.push({
				active: homeTabs.availability,
				href: "#",
				id: "2",
				onClick: () =>
					setHomeTabs({
						user: false,
						booking: false,
						student: false,
						settings: false,
						availability: true,
						home: false,
					}),
				title: "Manage Availability",
			});
		}

		return navigations;
	}, [homeTabs]);

	const { greeting } = useHomeHook();

	return (
		<>
			<Navbar />
			<div className="wrapper" suppressHydrationWarning>
				<ClientOnly>
					<Text color="purple.800" className="w-800 f-25  mb-5">
						{greeting},{" "}
						{user
							? user?.role === "student"
								? allGroup?.data?.filter(
										(grp: any) => grp._id === user?.groupId
								  )?.[0]?.group
									? allGroup?.data?.filter(
											(grp: any) => grp._id === user?.groupId
									  )?.[0]?.group
									: ""
								: user?.name
							: ""}
					</Text>
				</ClientOnly>
				<ClientOnly>
					<Navigation navigations={HomeNavigation} />
				</ClientOnly>
				<ClientOnly>
					{homeTabs.home && <PeopleHome auth={auth} />}
					{homeTabs.user && <User auth={auth} />}
					{homeTabs.booking && <Book auth={auth} />}
					{homeTabs.student && <StudentPage />}
					{homeTabs.settings && <SettingsPage />}
					{homeTabs.availability && <InstructorPage />}
				</ClientOnly>
			</div>
		</>
	);
}
