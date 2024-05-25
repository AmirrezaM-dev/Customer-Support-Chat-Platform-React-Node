import { Col, Container, Row, Form, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../Components/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const SignIn = () => {
	const {
		firstLogin,
		handleFormData,
		formData,
		login,
		validator,
		setValidator,
		regExEmail,
		loadingLogin,
	} = useAuth()
	return (
		<Container className="d-flex flex-column">
			<Row className="no-gutters text-center align-items-center justify-content-center min-vh-100">
				<Col sm={12} md={6} lg={5} xl={4}>
					<h1 className="font-weight-bold">Sign In</h1>
					<p className="text-dark mb-3">
						We are Different, We Make You Different.
					</p>
					<Form
						className="mb-3"
						noValidate
						onSubmit={(e) => {
							e.preventDefault()
							if (
								formData?.email &&
								regExEmail.test(formData.email) &&
								formData?.password
							) {
								setValidator((validator) => {
									return {
										...validator,
										email: true,
										password: true,
									}
								})
								login(formData)
							} else {
								!formData?.email
									? setValidator((validator) => {
											return {
												...validator,
												email: false,
											}
									  })
									: regExEmail.test(formData.email)
									? setValidator((validator) => {
											return { ...validator, email: true }
									  })
									: setValidator((validator) => {
											return {
												...validator,
												email: false,
												emailFeedback:
													"Please enter a valid email address",
											}
									  })
								!formData?.password
									? setValidator((validator) => {
											return {
												...validator,
												password: false,
											}
									  })
									: setValidator((validator) => {
											return {
												...validator,
												password: true,
											}
									  })
							}
						}}
					>
						<Form.Group className="mb-3">
							<Form.Control
								type="email"
								name="email"
								placeholder="Enter your email address"
								value={formData.email}
								onChange={(e) => handleFormData(e)}
								disabled={!firstLogin}
								isInvalid={validator.email === false}
								isValid={validator.email}
							/>
							<Form.Control.Feedback type="invalid">
								{validator?.emailFeedback
									? validator?.emailFeedback
									: "Please enter your email address"}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Control
								type="password"
								name="password"
								placeholder="Enter your password"
								value={formData.password}
								onChange={(e) => handleFormData(e)}
								disabled={!firstLogin}
								isInvalid={validator.password === false}
								isValid={validator.password}
							/>
							<Form.Control.Feedback type="invalid">
								{validator?.passwordFeedback
									? validator?.passwordFeedback
									: "Please enter your password"}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3">
							<Link className="font-size-sm" to="/forgot">
								Reset credentials
							</Link>
						</Form.Group>
						<Button
							variant="primary"
							size="lg"
							className="btn-block text-uppercase font-weight-semibold"
							type="submit"
							disabled={!firstLogin || loadingLogin}
						>
							{!firstLogin || loadingLogin ? (
								<FontAwesomeIcon icon={faSpinner} spin />
							) : (
								"Sign In"
							)}
						</Button>
					</Form>
					<p>
						Don't have an account?&nbsp;
						<Link className="font-weight-semibold" to="/signup">
							Sign Up
						</Link>
						.
					</p>
				</Col>
			</Row>
		</Container>
	)
}

export default SignIn
