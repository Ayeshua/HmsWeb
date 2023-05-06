import { getAuth } from 'firebase/auth';

import { firebase } from '../../config/fbConfig';
import { useDispatch } from 'react-redux';
import { setSignupMsg } from '../../data/redux/slices/login';
import { useCallback } from 'react';
import { DLINK_URL, LINK_URL } from '../../constants/AppData';
const auth = getAuth(firebase);

export const useAuth = () => {
	const dispatch = useDispatch();

	const actionLink = async (dLink, socialTitle, socialDescription, uid) => {
		let link;
		const socialImageLink =
			'https://firebasestorage.googleapis.com/v0/b/hospital-management-syst-996a1.appspot.com/o/hms.png?alt=media&token=21deff3e-9238-4fe1-8d23-beb84da1d143';

		try {
			link = `${DLINK_URL}?sd=${socialDescription.replaceAll(
				' ',
				'%2520',
			)}&si=${socialImageLink}&st=${socialTitle.replaceAll(
				' ',
				'%2520',
			)}&link=${LINK_URL}%2F%3Fid%3D${uid}%26type%3D1`;
			return { link };
		} catch (error) {
			console.log('link error ', error);
			return { error };
		}
	};
	// Listen for authentication state to change.
	const _sendEmailVerification = async (emailCallback) => {
		const user = auth.currentUser;
		if (user) {
			const { error, link } = await actionLink(
				`${LINK_URL}?id=${user.uid}&type=1&password=true`,
				'Verification Code for Hms',
				'Click Verification Code to verify your Hms account',
				user.uid,
			);
			if (link) {
				const actionCodeSettings = {
					url: link,
				};
				try {
					const { sendEmailVerification } = await import('firebase/auth');
					await sendEmailVerification(user, actionCodeSettings);
					dispatch(setSignupMsg(`Check ${user?.email} for verification code`));
					return emailCallback(user.email);
				} catch (error) {
					console.log('reset  email error ', error);
					return emailCallback(null, error.message);
				}
			} else {
				return emailCallback(null, error.message);
			}
		} else {
			return emailCallback(user.email);
		}
	};
	const _restPasswordAccount = async (email, emailCallback, dLink) => {
		let url = dLink;
		if (!url) {
			const { error, link } = await actionLink(
				`${LINK_URL}?type=1`,
				'Reset passward Code for Hms',
				'Click Reset passward Code to verify your Hms account',
			);
			if (link) {
				url = link;
			} else {
				return emailCallback(null, error.message);
			}
		}
		const actionCodeSettings = {
			url,
		};
		try {
			const { sendPasswordResetEmail } = await import('firebase/auth');

			await sendPasswordResetEmail(auth, email, actionCodeSettings);
			return emailCallback(email);
		} catch (error) {
			console.log('reset  email error ', error);
			return emailCallback(null, error.message);
		}

		// setConfirm(confirmation);
	};
	const _login = async (data, authCallback) => {
		try {
			const { signInWithEmailAndPassword } = await import('firebase/auth');

			await signInWithEmailAndPassword(auth, data.email, data.password);
			dispatch(setSignupMsg(null));

			authCallback();
			console.log('====================================');
		} catch (error) {
			console.log('====================================');
			console.log(error);
			console.log('====================================');
			authCallback(error.message);
		}
	};
	const handleResetPassword = useCallback(
		async (actionCode, passwordCallback) => {
			// Localize the UI to the selecteuage as determined by th
			// parameter.
			const { verifyPasswordResetCode } = await import('firebase/auth');
			// Verify the password reset code is valid.
			try {
				await verifyPasswordResetCode(auth, actionCode);
				passwordCallback(null, 'Email address has been verified');
			} catch (error) {
				passwordCallback(error.message);
			}
		},
		[],
	);

	const handleRecoverEmail = useCallback(async (actionCode, authCallback) => {
		// Confirm the action code is valid.
		const { checkActionCode, applyActionCode } = await import('firebase/auth');
		try {
			await checkActionCode(auth, actionCode);
			await applyActionCode(auth, actionCode);
			authCallback(null, 'Email address has been verified');
		} catch (error) {
			authCallback(error.message);
		}
	}, []);
	const handleVerifyEmail = useCallback(
		async (actionCode, authCallback, id) => {
			// Localize the UI to the selecteuage as determined by th
			// parameter.
			// Try to apply the email verification code.
			const { applyActionCode } = await import('firebase/auth');
			try {
				await applyActionCode(auth, actionCode);
				console.log(' we are in the house ');
				authCallback(null, 'Email address has been verified', id);
			} catch (error) {
				authCallback(error.message);
			}
		},
		[],
	);
	const handleReset = async (newPassword, actionCode, authCallback) => {
		// Save the new password.
		const { confirmPasswordReset } = await import('firebase/auth');
		try {
			await confirmPasswordReset(auth, actionCode, newPassword);
			authCallback(null, newPassword);
		} catch (error) {
			// Error occurred during confirmation. The code might have expired or the
			// password is too weak.
			authCallback(error.message, null, null);
		}
	};

	return {
		_login,
		handleReset,
		handleVerifyEmail,
		handleRecoverEmail,
		handleResetPassword,
		_sendEmailVerification,
		_restPasswordAccount,
	};
};
