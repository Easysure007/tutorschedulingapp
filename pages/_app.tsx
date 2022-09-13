import "../styles/globals.css";
import "../styles/style.css";
import "../components/UI/navigations/nav.css";
import "../components/dashboard/home.css";
import { ChakraProvider } from "@chakra-ui/react";
import React, { createContext, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { DataArchive } from "../store/store-achieve";
import { IStore } from "../store/store-interface";

const iSSERVER = typeof window === "undefined";
const auth: any = !iSSERVER
	? JSON.parse(`${localStorage.getItem("auth")}`)
	: undefined;

export const MobxContext = createContext<IStore>({} as IStore);
export const useStoreContext = () => useContext(MobxContext);

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const excludedPaths = ["/auth/login", "/auth/student"];

	axios.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			if (
				error.response.status === 401 &&
				!excludedPaths.includes(router.pathname)
			) {
				if (auth?.user?.role === "instructor") {
					window.location.assign("/auth/user");
				} else {
					window.location.assign("/auth/login");
				}
			}
			return Promise.reject(error);
		}
	);

	return (
		<MobxContext.Provider value={DataArchive}>
			<ChakraProvider>
				<Component {...pageProps} />
				<ToastContainer theme={"dark"} />
			</ChakraProvider>
		</MobxContext.Provider>
	);
}

export default MyApp;
