import { memo, lazy, Suspense } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import styled from 'styled-components';

import { colors } from '../constants/colors';

const CustomBtn = lazy(() => import('./CustomBtn'));

const Div = styled.div`
	width: 100%;
	border: rgb(229, 230, 229) 1px solid;
	border-radius: 40px;
	margin: 17px 0px;
	padding: 30px 40px;
	h3 {
		color: ${colors.tertiary};
	}
	p {
		color: ${colors.primary};
		white-space: pre-line;
	}
`;

function Header({ label, sub, btnLabel, searching, btnClicked }) {
	return (
		<Div>
			<Row>
				<Col>
					<h3>{label}</h3>
					{sub && <p>{sub}</p>}
				</Col>

				{btnLabel && (
					<Col
						md='auto'
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Suspense fallback={<Spinner />}>
							<CustomBtn
								label={btnLabel}
								type='button'
								uploading={searching}
								disabled={searching}
								color1={!searching ? colors.primary : colors.coolGray}
								color2={!searching ? colors.secondary : colors.coolGray}
								btnClicked={() => btnClicked()}
								margin='0px'
							/>
						</Suspense>
					</Col>
				)}
			</Row>
		</Div>
	);
}

export default memo(Header);
