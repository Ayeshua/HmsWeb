import React, { useEffect } from 'react';
import { setUser } from './data/redux/slices/login';

import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from './components/SplashScreen';
import { getAuth, onIdTokenChanged, getIdTokenResult } from 'firebase/auth';

import { firebase } from './config/fbConfig';

const auth = getAuth(firebase);
function AuthIsLoaded({ children }) {
	const { user } = useSelector(({ hms_login }) => hms_login);
	console.log('user ', user?.emailVerified);
	const { reAuth } = user;

	const dispatch = useDispatch();

	// Handle user state changes
	const onAuthStateChanged = (currentUser) => {
		if (currentUser) {
			getIdTokenResult(currentUser, true).then((idTokenResult) => {
				const { categoryId, status } = idTokenResult.claims;
				const { uid, emailVerified } = currentUser;
				console.log('emailVerified ', emailVerified);

				dispatch(
					setUser({
						uid,
						emailVerified,
						categoryId,
						status,
						reAuth: true,
					}),
				);
			});
		} else {
			dispatch(setUser({ reAuth: true }));
		}
		//dispatch(setCurrentMeter(null))
	};

	useEffect(() => {
		const subscriber = onIdTokenChanged(auth, onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);
	if (!reAuth) return <SplashScreen />;
	return children;
}

export default AuthIsLoaded;
