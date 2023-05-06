import { useCallback } from 'react';
import { pick, isEmpty } from 'lodash';
import randomUUUID from '../../utils/UUUID';
import { firebase } from '../../config/fbConfig';

export const useStore = () => {

	const addModData = useCallback(
		async (data, id, pathName, picker, callback) => {
			console.log('id ', id);

			const _id = !isEmpty(id) ? id : randomUUUID();
			const fieldId=`${pathName.toLowerCase()}Id`
			const newRecord = picker
				? {
					[fieldId]:_id,
					...pick(data, picker),
				  }
				: data;
			const { doc, getFirestore, setDoc } = await import('firebase/firestore');
			const db = getFirestore(firebase);
			await setDoc(doc(db, `${pathName}/${_id}`), newRecord, { merge: true });

			if (callback) {
				callback();
			}
		},
		[],
	);

	return {
		addModData,
	};
};
