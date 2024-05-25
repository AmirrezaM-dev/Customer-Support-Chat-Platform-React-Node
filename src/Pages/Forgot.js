import { Col, Container, Row, Form, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../Components/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const Forgot = () => {
	const {
		firstLogin,
		handleFormData,
		formData,
		resetPassword,
		validator,
		setValidator,
		regExEmail,
		loadingLogin,
	} = useAuth()
	return (
		<Container className="d-flex flex-column">
			<Row className="no-gutters text-center align-items-center justify-content-center min-vh-100">
				<Col sm={12} md={6} lg={5} xl={4}>
					<h1 className="font-weight-bold">Reset credentials</h1>
					<p className="text-dark mb-3">
						Enter your email address to reset credentials.
					</p>
					<Form
						noValidate
						className="mb-3"
						onSubmit={(e) => {
							e.preventDefault()
							if (
								formData?.email &&
								regExEmail.test(formData.email)
							) {
								setValidator((validator) => {
									return {
										...validator,
										email: true,
										password: true,
									}
								})
								resetPassword(formData)
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
								value={formData.email}
								onChange={(e) => handleFormData(e)}
								placeholder="Enter your email address"
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
								"Send reset link"
							)}
						</Button>
					</Form>
					<p>
						<Link className="font-weight-semibold" to="/signin">
							Sign In
						</Link>
						&nbsp;
						<Link className="font-weight-semibold" to="/signup">
							Sign Up
						</Link>
					</p>
				</Col>
			</Row>
		</Container>
	)
}

export default Forgot
