import { useEffect, useState, lazy, Suspense } from 'react';
import Wrapper from '../wrapper';

import { useSelector } from 'react-redux';
import { startCase } from 'lodash';
import { Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/auth/useAuth';
const Header = lazy(() => import('../components/Header'));

function AuthLink() {
	const [searching, setSearching] = useState(false);
	const [url, seturl] = useState();

	const { email } = useSelector(({ hms_login: { user } }) => user);
	const { _restPasswordAccount, _sendEmailVerification } = useAuth();

	const authCallback = () => {
		setSearching(false);
	};
	useEffect(() => {
		const location = new URL(window.location.href);

		// (Optional) Get the language code if available.
		seturl({
			from: location.searchParams.get('return'),
			header: location.searchParams.get('header') === 'true',
			type: startCase(location.searchParams.get('type')),
		});
	}, []);
	return (
		<Wrapper>
			{url && url.header && (
				<Suspense fallback={<Spinner />}>
					<Header
						searching={searching}
						label={url.type}
						sub={`Check ${email} for verification link, in inbox or spam/junk`}
						btnLabel={email ? 'Send link' : null}
						btnClicked={async () => {
							setSearching(true);
							const { type, from } = url;
							if (type === 'Password Reset') {
								_restPasswordAccount(email, authCallback, from);
							} else {
								_sendEmailVerification(authCallback);
							}
						}}
					/>
				</Suspense>
			)}
		</Wrapper>
	);
}

export default AuthLink;
