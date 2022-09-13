import { useState, useMemo } from "react";
import { Flex } from "@chakra-ui/react";
import StudentBooking from "./booking";

export default function StudentPage() {
	const [nav] = useState({
		booking: true,
		availability: false,
	});

	return (
		<div style={{ width: "100%", border: "100%" }}>
			<Flex m="20px 10px" width="100%">
				<div style={{ width: "100%" }}>{nav.booking && <StudentBooking />}</div>
			</Flex>
		</div>
	);
}
