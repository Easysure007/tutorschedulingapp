import type { NextPage } from "next";

import UserLogin from "./auth/student";

const Home: NextPage = () => {
	return (
		<div>
			<UserLogin />
		</div>
	);
};

export default Home;
