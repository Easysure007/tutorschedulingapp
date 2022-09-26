import { useState, useEffect } from "react";

export const useHomeHook = () => {
	const [greeting, setGreeting] = useState("");

	//  HOOK USED TO CALCULATE THE DATE AND TIME IN ORDER TO  RETURN THE APPROPRIATE GREETING

	useEffect(() => {
		const date = new Date();
		const currentHour = date.getHours();
		if (currentHour >= 0 && currentHour <= 11) {
			setGreeting("Good morning");
		} else if (currentHour >= 12 && 17 >= currentHour) {
			setGreeting("Good afternoon");
		} else if (currentHour >= 18) {
			setGreeting("Good evening");
		}
	}, []);
	return {
		greeting,
	};
};
