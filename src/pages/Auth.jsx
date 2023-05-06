import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Wrapper from '../wrapper';
import InputModal from '../components/InputModal';
import { useSelector, useDispatch } from 'react-redux';
import { parse } from 'detect.js';

import { omit, startCase } from 'lodash';
import { useAuth } from '../hooks/auth/useAuth';
import { useMe } from '../hooks/useMe';
import { useFunc } from '../hooks/functions/useFunc';
import { useStore } from '../hooks/use-store';
import { setSignupMsg } from '../data/redux/slices/login';

function Auth() {
	const history = useHistory();
	const [searching, setSearching] = useState(false);
	const ref = useRef();
	const [title, setTitle] = useState('Verifying Your Account');
	const [sub, setSub] = useState('Please wait...');
	const [isProg, setProg] = useState(true);
	const [link, setLink] = useState(null);
	const [modalShow, setModalShow] = useState(false);
	const dispatch = useDispatch();
	const userLocal = useSelector(({ hms_login: { user } }) => user);
	const {
		_login,
		handleVerifyEmail,
		handleRecoverEmail,
		handleResetPassword,
		handleReset,
		_sendEmailVerification,
	} = useAuth();
	const { _updatePassword, _updateUser } = useMe();
	const { callFunc } = useFunc();
	const { addModData } = useStore();
	//const {isEmpty,uid,isComplete,user_type}=current||{};
	const user = useMemo(() => userLocal, [userLocal]);
	const { reAuth, emailVerified } = user;
	const [payload, setPayload] = useState();
	const onErr = useCallback(
		(err) => {
			setTitle('Error');
			setSub(err);
			setLink(
				reAuth && !emailVerified && ref.current.mode === 'verifyEmail'
					? 'Send link'
					: null,
			);
		},
		[reAuth, emailVerified],
	);
	const emailCallback = (isAuth, err) => {
		setSearching(false);
		if (err) {
			setTitle('Error');
			setSub(err);
			setLink(
				reAuth && !emailVerified && ref.current.mode === 'verifyEmail'
					? 'Send link'
					: null,
			);
		} else {
			const { email } = ref.current;
			if (isAuth) {
				const type =
					ref.current.mode === 'resetPassword'
						? 'Password Reset'
						: ref.current.mode === 'verifyEmail'
						? 'Email Verification'
						: 'Confirm Email';
				console.log('type ', type, 'email ', email);
				history.replace('/email_verification', {
					from: ref.current.from,
					type,
					email,
				});
			} else {
				passwordCallback(null, email, 'Login');
			}
		}
	};
	const generalMessage = () => {
		setProg(true);

		setTitle('Proccessing');

		setSub('please wait...');
		setLink(null);
	};
	const buildDialog = useCallback(async (init, entries) => {
		generalMessage();
		setPayload({
			title: 'Loading',
			body: 'Please waiting...',
		});
		setModalShow(true);
		const { parseData } = await import('../utils/ParseData');
		const res = parseData(entries);
		console.log('payload res ', res);

		setPayload({ ...init, ...res });
	}, []);

	const goTo = useCallback(async () => {
		setProg(false);

		const {
			from: { href },
			link,
		} = ref.current;
		console.log('href ', href);

		const {
			device: { type },
		} = parse(navigator.userAgent);
		console.log('ua ', type, ' navigator.userAgent ', navigator.userAgent);
		if (type === 'Desktop') {
			window.open(link, '_self');
		} else {
			try {
				window.open(href, '_self');
			} catch (error) {
				window.open(link, '_self');
			}
		}
	}, []);
	const passwordInput = useCallback(
		async (title) => {
			const { passwordObj } = await import('../constants/AppData');

			buildDialog(
				{
					title,
					body: title === 'Login' ? 'Enter Password' : 'Enter new Password',
					fullscreen: true,
					action: 'Proceed',
					//currentData: { email },
				},
				{ data: [passwordObj] },
			);
		},
		[buildDialog],
	);
	const updatePassword = useCallback(
		async (password) => {
			_updatePassword(password);
			goTo();
		},
		[goTo, _updatePassword],
	);

	const signinCallback = async (err) => {
		console.log('signinCallback in err inner ' + err);

		if (err) {
			console.log('signinCallback in err inner ' + err);
			if (modalShow) {
				setPayload({
					...payload,
					body: 'Something went wrong, try again',
					isLogging: false,
				});
			}
			onErr(err);
		} else {
			const { title, action } = payload;

			if (title === 'Enter Credential') {
				setSearching(true);

				_sendEmailVerification(emailCallback);
			} else if (action === 'Register') {
				const { username, password, id, email, status, categoryId } =
					ref.current;
				await _updatePassword(password);
				const name = username.toLowerCase();
				await _updateUser({ name });
				await callFunc(
					{ email, payload: { categoryId, status: 1 } },
					'addCustom',
				);
				const data = {
					updatedAt: new Date(),
				};
				await addModData(
					status
						? data
						: {
								...data,

								status: 1,
						  },
					id,
					categoryId,
				)
				setTitle('Account setup');
				setSub('Successful');
				setModalShow(false);

				goTo();
			}
		}
	};

	const authCallback = useCallback(
		async (err, msg) => {
			console.log('authCallback err ', err, ' msg ', msg);
			if (err) {
				setProg(false);

				setTitle('Error');

				setSub(err);
				setLink(
					(user?.email && ref.current.mode === 'verifyEmail') ||
						ref.current.password
						? 'Send link'
						: null,
				);
			} else {
				const { id, password } = ref.current;
				const { user } = await callFunc({ id }, 'regUser');
				const {
					customClaims: { categoryId, status },
					email,
					metadata: { creationTime: createdAt },
					displayName: username,
				} = user;
				console.log(
					'data id ',
					id,
					' email ',
					email,
					' password ',
					password,
					' status ',
					username,
				);
				if (!status) {
					await callFunc({ email, payload: { status: 1 } }, 'addCustom');
				}

				if (password) {
					ref.current = {
						...ref.current,
						categoryId,
						status,
						email,
						createdAt,
						username,
					};
					const {
						entry_form: { register_as },
						passwordObj,
					} = await import('../constants/AppData');

					buildDialog(
						{
							//email,
							username,
							password: '',
							terms: false,
						},
						{
							...omit(register_as, 'data'),
							data: [
								{
									name: 'username',
									err: 'username required',
									type: 'text',
									val: username ? startCase(username) : '',
								},

								passwordObj,
								...register_as.data,
							],
						},
					);
				} else {
					setProg(false);
					setSub(msg);
					goTo();
				}
			}
		},
		[user, goTo, callFunc, buildDialog],
	);

	const confirmCallback = async (err, password) => {
		if (err) {
			onErr(err);
		} else {
			setSub('Password reset has been confirmed and new password updated');
			setModalShow(false)
			const { id } = ref.current;
			const { user } = await callFunc({ id }, 'regUser');
				
			if(user){
				
				_login({ email:user.email, password }, goTo);
			}
		}
	};

	const passwordCallback = useCallback(
		async (err, email, action = 'Reset Password') => {
			if (err) {
				onErr(err);
			} else {
				passwordInput( action);
			}
		},
		[onErr, passwordInput],
	);
	const expAuth = useCallback(
		async (actionCode, mode) => {
			// Handle the user management action.
			switch (mode) {
				case 'resetPassword':
					// Display reset password handler and UI.
					setTitle('Reset password');

					handleResetPassword(actionCode, passwordCallback);
					break;
				case 'recoverEmail':
					// Display email recovery handler and UI.
					setTitle('Confirm email');

					handleRecoverEmail(actionCode, authCallback);
					break;
				case 'verifyEmail':
					// Display email verification handler and UI.

					handleVerifyEmail(actionCode, authCallback, ref.current.id);
					break;
				default:
				// Error: invalid mode.
			}
		},
		[
			passwordCallback,
			authCallback,
			handleResetPassword,
			handleRecoverEmail,
			handleVerifyEmail,
		],
	);

	useEffect(() => {
		dispatch(setSignupMsg(null));

		const location = new URL(window.location.href);

		const mode = location.searchParams.get('mode');
		// Get the one-time code from the query parameter.
		const actionCode = location.searchParams.get('oobCode');
		// (Optional) Get the continue URL from the query parameter if available.
		const continueUrl = location.searchParams.get('continueUrl');
		// (Optional) Get the language code if available.
		let url, id, admin, link, password;

		if (continueUrl) {
			url = new URL(continueUrl);
			link = new URL(url.searchParams?.get('link'));

			id = link?.searchParams?.get('id');
			password = link?.searchParams?.get('password');
			admin = link?.searchParams?.get('admin');
		}
		ref.current = {
			from: url,
			actionCode,
			mode,
			id,
			admin,
			link,
			password,
		};
		console.log(
			'location ',
			location,
			'mode ',
			mode,
			'ref.current ',
			ref.current,
		);
		expAuth(actionCode, mode);
	}, [expAuth]);
	return (
		<Wrapper>
			{isProg && <ProgressBar animated now={100} />}{' '}
			<Header
				searching={searching}
				label={title}
				sub={sub}
				btnLabel={link}
				btnClicked={async () => {
					setSearching(true);

					_sendEmailVerification(emailCallback);
				}}
			/>
			{payload && (
				<InputModal
					{...{ payload }}
					show={modalShow}
					onActionFun={async ({ password, link, ...rest }) => {
						const { title, action } = payload;
						setPayload({ ...payload, isLogging: true });

						if (title === 'Reset Password') {
							handleReset(password, ref.current.actionCode, confirmCallback);
						} else if (title === 'Enter Credential') {
							_login({ email: ref.current.email, password }, signinCallback);
						} else if (action === 'Set Password') {
							updatePassword(password);
						} else if (action === 'Register') {
							console.log(
								'get data id user_data Register ',
								ref.current.email,
								' rest ',
								rest,
								'process.env.REACT_APP_PASSWORD_KEY ',
								process.env.REACT_APP_PASSWORD_KEY,
							);
							ref.current = { ...ref.current, ...rest, password };

							_login(
								{
									email: ref.current.email,
									password: process.env.REACT_APP_PASSWORD_KEY,
								},
								signinCallback,
							);
						}
					}}
					onHide={() => setModalShow(false)}
				/>
			)}
		</Wrapper>
	);
}

export default Auth;
