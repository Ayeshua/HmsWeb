import React from 'react';
import { Container } from 'react-bootstrap';
import SubNav from '../components/SubNav';

function Wrapper({ children }) {
	console.log('children ', children);
	return (
		<Container>
			<SubNav />

			{children}
		</Container>
	);
}

export default Wrapper;
