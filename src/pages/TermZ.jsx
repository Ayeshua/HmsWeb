import { Container } from 'react-bootstrap';
import SubNav from '../components/SubNav';
import { policy } from '../constants/AppData';

const TermZ = () => (
	<Container>
		<SubNav />
		{/* <Header label="Terms and Conditions" />
		 */}
		<p
			style={{
				fontSize: '20px',
				margin: '17px 0px',
				whiteSpace: 'pre-line',
			}}
		>
			{policy}
		</p>
	</Container>
);

export default TermZ;
