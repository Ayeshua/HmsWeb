import { useMemo } from 'react';
import LogoSVG from '../components/logoComp';

function Home() {
	const signupMsg = useMemo(() => {
		const location = new URL(window.location.href);

		const type = location.searchParams?.get('type');
		return type ? 'You Are Verified, Open Hms:App' : 'Hms:App';
	}, []);
	return (
		<div className='App'>
			<header className='App-header'>
				<LogoSVG />
				<p>{signupMsg}</p>
			</header>
		</div>
	);
}

export default Home;
