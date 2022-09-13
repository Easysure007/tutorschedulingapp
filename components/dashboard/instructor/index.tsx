import { useState, useMemo } from "react";
import { Flex } from "@chakra-ui/react";

import ManageBookings from "./manage-bookings";
import { SideNavigation } from "../../UI/navigations/side_nav";
import ViewAvailability from "./view-availability";

export default function InstructorPage() {
	const [nav, setNav] = useState({
		availability: true,
		booking: false,
	});
	const Navigation = useMemo(() => {
		const navigations = [
			{
				active: nav.availability,
				href: "#",
				id: "1",
				onClick: () =>
					setNav({
						availability: true,
						booking: false,
					}),
				title: "Availability",
			},
			// {
			// 	active: nav.booking,
			// 	href: "#",
			// 	id: "2",
			// 	onClick: () =>
			// 		setNav({
			// 			availability: false,
			// 			booking: true,
			// 		}),
			// 	title: "Bookings",
			// },
		];

		return navigations;
	}, [nav]);
	return (
		<div style={{ width: "100%", border: "100%" }}>
			<Flex m="20px 10px" width="100%">
				<div>
					<SideNavigation navigations={Navigation} />
				</div>
				<div style={{ width: "100%" }}>
					{nav.availability && <ViewAvailability />}
					{/* {nav.booking && <ManageBookings />} */}
				</div>
			</Flex>
		</div>
	);
}
