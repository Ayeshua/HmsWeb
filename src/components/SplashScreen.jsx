import { memo } from 'react';
import LogoSVG from './logoComp';

const SplashScreen = () => (
	<div className='App-header'>
		<LogoSVG />
	</div>
);

export default memo(SplashScreen);
