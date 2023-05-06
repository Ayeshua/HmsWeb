import { memo } from 'react';
import { Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import LogoSVG from './logoComp';

function SubNav() {
	const history = useHistory();

	return (
		<Navbar variant='light'>
			<Navbar.Brand
				style={{ cursor: 'pointer' }}
				onClick={() => history.push(`/`)}
			>
				<LogoSVG className='logo' />
			</Navbar.Brand>
		</Navbar>
	);
}

export default memo(SubNav);
