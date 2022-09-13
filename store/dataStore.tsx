import { observable, action, makeAutoObservable } from "mobx";
import { useStaticRendering } from "mobx-react";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer);

interface IDataStore {
	user: {
		token: string;
		user: {
			name: "";
		};
	};
}
const iSSERVER = typeof window === "undefined";

export class DataStore {
	@action
	fetchAuthFromLocalStorage = () => {
		const localStorageAuth = !iSSERVER && localStorage.getItem("auth");
		return localStorageAuth ? JSON.parse(localStorageAuth)?.user : null;
	};
	@action
	fetchTokenFromLocalStorage = () => {
		const localStorageAuth = !iSSERVER && localStorage.getItem("auth");
		return localStorageAuth ? JSON.parse(localStorageAuth).accessToken : null;
	};
	@observable token: null | any = this.fetchTokenFromLocalStorage();
	@observable
	user: null | any | undefined = this.fetchAuthFromLocalStorage();
	@observable groups: any = [];

	constructor() {
		makeAutoObservable(this);
	}
	@observable reload = false;
	@observable resetEmail = "";
	@action setReload = (status: boolean) => {
		this.reload = status;
	};
	@action updateUser = () => {
		const localStorageAuth = !iSSERVER && localStorage.getItem("auth");
		const getUser = localStorageAuth
			? JSON.parse(localStorageAuth)?.user
			: null;
		this.user = getUser;
	};
	@action
	updateResetEmail = (email: string) => {
		this.resetEmail = email;
	};
	@observable amount: any;
	hydrate(contractStore: IDataStore) {
		if (!this.user) return;
		this.user({ fullName: "" });
	}
	@action setGroups = (data: any) => {
		this.groups = data;
	};
	clearAuth = (callback?: () => void) => {
		try {
			this.user;
			localStorage.removeItem("auth");
			localStorage.clear();
			this.user = null;
			if (callback) {
				callback();
			}
		} catch (e: any) {
			return false;
		}
	};
}
export const storeData = new DataStore();
