import React, {
	useState,
	useContext,
	createContext,
	useEffect,
	FC,
	useMemo,
	useCallback,
} from "react";
import Firebase from "./firebase";
import qs from "qs";
import { useSetRecoilState } from "recoil";
import { importHashState, remoteDataState } from "../../State";

type Data = {
	firebase: Firebase | null | undefined;
	authUser: firebase.default.User | null | undefined;
};

const FirebaseContext = createContext<Data | undefined>(undefined);

export function useFirebase() {
	const result = useContext(FirebaseContext);
	if (!result) {
		throw Error("whoops");
	}
	return result;
}

const { Provider } = FirebaseContext;

const FirebaseProvider: FC = ({ children }) => {
	const [firebase, setFirebase] = useState<Firebase>();
	const [authUser, setAuthUser] = useState<firebase.default.User | null>();
	const setRemoteData = useSetRecoilState(remoteDataState);
	const setImportHash = useSetRecoilState(importHashState);
	useEffect(() => {
		setFirebase(new Firebase());
	}, []);

	const updateRemoteData = useCallback(
		(snapshot: any) => {
			if (snapshot.val()) {
				setRemoteData(snapshot.val()["configHash"]);
			}
		},
		[setRemoteData]
	);

	useEffect(() => {
		if (!firebase) return;
		firebase.auth.onAuthStateChanged((authUser) => {
			setAuthUser(authUser);
			if (authUser) {
				firebase
					.spoilerFilter(authUser.uid)
					.get()
					.then(updateRemoteData);
			} else {
				setRemoteData(undefined);
			}
		});
	}, [firebase, setRemoteData, updateRemoteData]);

	useEffect(() => {
		if (!firebase) {
			return;
		}

		const urlParams = qs.parse(window.location.search.substr(1));
		const importUserId = urlParams["importFrom"] as string;
		if (!importUserId) {
			return;
		}

		firebase.spoilerFilter(importUserId).on(
			"value",
			(snapshot) => {
				if (snapshot.val()) {
					setImportHash(snapshot.val()["configHash"]);
				}
				return;
			},
			(error: any) => {
				console.log(error);
			}
		);
	}, [firebase, setImportHash]);

	useEffect(() => {
		if (!firebase || !authUser) {
			return;
		}
		firebase.spoilerFilter(authUser.uid).on("value", updateRemoteData);
	}, [firebase, authUser, updateRemoteData]);

	const value = useMemo(() => ({ firebase, authUser }), [firebase, authUser]);

	return <Provider value={value}>{children}</Provider>;
};

export default FirebaseProvider;
