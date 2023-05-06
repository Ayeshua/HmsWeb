import { memo, useRef, useState, useEffect } from 'react';

import {
	Modal,
	Button,
	Container,
	Row,
	FloatingLabel,
	Form,
	InputGroup,
	Spinner,
	Col,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { startCase } from 'lodash';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

function InputModal({
	payload: {
		title,
		body,
		schema,
		data,
		object,
		initData = {},
		action,
		isLogging,
		closeButton,
		fullscreen,
	},
	show,
	onHide,
	onDelFun,
	onActionFun,
	phone_code,
}) {
	const formRef = useRef();
	const [showPassword, setShow] = useState(false);
	const [info, setinfo] = useState();
	const { header, content, page } = info || {};
	useEffect(() => {
		setinfo({ header: title, content: body, page: 0 });
	}, [title, body]);

	return (
		<Modal
			{...{ show, onHide, fullscreen }}
			//onHide={onHide}

			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header {...{ closeButton }}>
				<Modal.Title id='contained-modal-title-vcenter'>
					{
						<Row>
							{page > 0 && (
								<Col>
									<FaArrowLeft
										onClick={() =>
											setinfo({ header: title, content: body, page: 0 })
										}
									/>
								</Col>
							)}
							<Col>
								<h3>{header}</h3>
							</Col>
						</Row>
					}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Row>
						{header !== 'Terms and Conditions' ? (
							<h6>{content}</h6>
						) : (
							<p style={{ whiteSpace: 'pre-line' }}>{content}</p>
						)}
					</Row>
					{data && (
						<Formik
							initialValues={initData}
							validationSchema={object(schema)}
							onSubmit={onActionFun}
							innerRef={formRef}
						>
							{({
								handleSubmit,
								errors,
								values,
								handleChange,
								touched,
								isValid,
								getFieldProps,
							}) => (
								<>
									<Form
										noValidate
										onSubmit={(e) => {
											e.preventDefault();
											handleSubmit(e);
										}}
									>
										{data.map((entry) => (
											<div key={entry.name}>
												<>
													{console.log(
														'entry ',
														values,
														' errors ',
														errors,
														' isValid ',
														isValid,
													)}
												</>
												{entry &&
													(entry.type === 'password' ||
														entry.type === 'phone' ||
														entry.type === 'number' ||
														entry.type === 'email' ||
														entry.type === 'text') && (
														<Form.Group
															controlId={`formBasic${entry.name}`}
															className='is-invalid'
														>
															<InputGroup className='mb-3'>
																{entry.type === 'phone' && (
																	<InputGroup.Text>
																		{phone_code}
																	</InputGroup.Text>
																)}
																<FloatingLabel
																	label={startCase(entry.label || entry.name)}
																>
																	<Form.Control
																		type={
																			showPassword || entry.name !== 'password'
																				? 'text'
																				: 'password'
																		}
																		placeholder={startCase(
																			entry.hint || entry.name,
																		)}
																		name={entry.name}
																		{...getFieldProps(entry.name)}
																		isValid={
																			touched[entry.name] && !errors[entry.name]
																		}
																		isInvalid={
																			touched[entry.name] &&
																			!!errors[entry.name]
																		}
																	/>
																</FloatingLabel>

																{entry.appex && (
																	<>
																		{entry.appex === 'password' ? (
																			<Button
																				onClick={() => setShow(!showPassword)}
																				variant='outline-secondary'
																			>
																				{showPassword ? (
																					<FaEyeSlash />
																				) : (
																					<FaEye />
																				)}
																			</Button>
																		) : (
																			<InputGroup.Text>
																				{entry.appex}
																			</InputGroup.Text>
																		)}
																	</>
																)}
																<Form.Control.Feedback type='invalid'>
																	{errors[entry.name]}
																</Form.Control.Feedback>
															</InputGroup>
														</Form.Group>
													)}
												{entry.type === 'select' && (
													<Form.Group controlId='formBasicReg'>
														<FloatingLabel
															label={startCase(entry.label || entry.name)}
														>
															<Form.Select
																name={entry.label || entry.name}
																{...getFieldProps(entry.label || entry.name)}
															>
																{entry.payload.map(({ label, value }) => (
																	<option key={label} value={value}>
																		{label}
																	</option>
																))}
															</Form.Select>
														</FloatingLabel>
													</Form.Group>
												)}

												{entry.type === 'checkbox' && (
													<>
														{entry.header && <h6>{entry.header}</h6>}
														<Form.Check type='checkbox' id={`check-api`}>
															<Form.Check
																required={entry.err}
																name={entry.name}
																checked={values[entry.name]}
																onChange={handleChange}
																isInvalid={
																	touched[entry.name] && !!errors[entry.name]
																}
															/>
															<Form.Check.Label>
																{entry.label}{' '}
																{entry.span && (
																	<span
																		onClick={() =>
																			setinfo({
																				header: entry.header,
																				content: entry.policy,
																				page: 1,
																			})
																		}
																		style={{ color: 'blue', cursor: 'pointer' }}
																	>
																		{entry.span}
																	</span>
																)}
															</Form.Check.Label>
															<Form.Control.Feedback type='invalid'>
																{errors[entry.name]}
															</Form.Control.Feedback>
														</Form.Check>
													</>
												)}
											</div>
										))}
									</Form>
								</>
							)}
						</Formik>
					)}
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<div style={{ flex: 1, justifyContent: 'space-evenly' }}>
					{onDelFun && (
						<Button
							variant='danger'
							style={{ margin: 7 }}
							onClick={(e) => {
								e.stopPropagation();

								onDelFun();
							}}
						>
							Delete
						</Button>
					)}
					<>
						{console.log(
							'isLogging  ',
							isLogging,
							' data && formRef.current ',
							formRef.current,
						)}
					</>

					{action && (
						<Button
							style={{ margin: 7 }}
							disabled={isLogging}
							onClick={(e) => {
								e.stopPropagation();
								console.log(' data formRef.current ', formRef.current);
								if (data && formRef.current) {
									console.log(' data formRef.current inner', formRef.current);

									formRef.current.handleSubmit(e);
								} else {
									console.log(' data formRef.current outer');

									onActionFun(initData);
								}
							}}
						>
							{isLogging && (
								<Spinner
									as='span'
									animation='border'
									role='status'
									aria-hidden='true'
								/>
							)}
							<span>{action}</span>
						</Button>
					)}
				</div>
			</Modal.Footer>
		</Modal>
	);
}

export default memo(InputModal);
