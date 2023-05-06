import { firebase } from '../../config/fbConfig';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useCallback } from 'react';
const functions = getFunctions(firebase);

export const useFunc = () => {
	const callFunc = useCallback(async (data, name) => {
		const response = await httpsCallable(functions, name)(data);
		return response.data;
	}, []);

	return {
		callFunc,
	};
};
