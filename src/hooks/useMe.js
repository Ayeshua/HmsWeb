import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { useCallback } from 'react';

import { firebase } from '../config/fbConfig';

const auth = getAuth(firebase);

export const useMe = () => {
	const _updatePassword = useCallback(async (password) => {
		const user = auth.currentUser;
		try {
			await updatePassword(user, password);
			console.log('_updatePassword done ');
		} catch (err) {
			console.log('_updatePassword err ', err.message);
		}
	}, []);

	const _updateUser = async ({ name }) => {
		const user = auth.currentUser;
		try {
			await updateProfile(user, {
				displayName: name,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return { _updateUser, _updatePassword };
};
