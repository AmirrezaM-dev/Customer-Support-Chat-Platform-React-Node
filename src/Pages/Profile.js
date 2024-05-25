import {
	faArrowLeft,
	// faCaretDown,
	faSpinner,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import {
	Button,
	// Dropdown,
	Row,
	Col,
	Form,
	Card,
	Container,
} from "react-bootstrap"
// import { Link } from "react-router-dom"
import { useAuth } from "../Components/useAuth"
const Profile = () => {
	const { authApi, user, setUser, regExEmail } = useAuth()
	const [isProfileSaving, setIsProfileSaving] = useState(false)
	const [formProfileData, setFormProfileData] = useState({
		fullname: user.fullname,
		username: user.username,
		email: user.email,
	})
	const [profileValidator, setProfileValidator] = useState({
		fullname: undefined,
		username: undefined,
		email: undefined,
	})
	const handleSaveProfile = (e) => {
		e.preventDefault()
		if (!isProfileSaving) {
			if (
				formProfileData.username.length &&
				formProfileData.email.length &&
				regExEmail.test(formProfileData.email)
			) {
				setIsProfileSaving(true)
				authApi
					.post("/api/users/saveProfile", formProfileData)
					.then((response) => {
						setUser((user) => {
							return { ...user, ...response.data }
						})
						setProfileValidator((validator) => {
							return {
								...validator,
								fullname: true,
								fullnameFeedback: undefined,
								email: true,
								emailFeedback: undefined,
								username: true,
								usernameFeedback: undefined,
							}
						})
					})
					.catch((e) => {
						if (e?.response?.status === 400) {
							if (
								e?.response?.data?.error ===
								"Username already exists"
							)
								setProfileValidator((validator) => {
									return {
										...validator,
										username: false,
										usernameFeedback:
											"Username already exists",
									}
								})
							else if (
								e?.response?.data?.error ===
								"Email already exists"
							)
								setProfileValidator((validator) => {
									return {
										...validator,
										email: false,
										emailFeedback: "Email already exists",
									}
								})
							else
								setProfileValidator((validator) => {
									return {
										...validator,
										email: false,
										emailFeedback: "Something went wrong",
										username: false,
										usernameFeedback:
											"Something went wrong",
									}
								})
						} else {
							setProfileValidator((validator) => {
								return {
									...validator,
									email: false,
									emailFeedback: "Something went wrong",
									username: false,
									usernameFeedback: "Something went wrong",
								}
							})
						}
					})
					.finally(() => {
						setIsProfileSaving(false)
					})
			} else {
				if (!formProfileData.email.length)
					setProfileValidator((validator) => {
						return { ...validator, email: false }
					})
				else if (!regExEmail.test(formProfileData.email))
					setProfileValidator((validator) => {
						return {
							...validator,
							email: false,
							emailFeedback: "Please enter a valid email",
						}
					})
				else
					setProfileValidator((validator) => {
						return { ...validator, email: true }
					})
				if (!formProfileData.username.length)
					setProfileValidator((validator) => {
						return { ...validator, username: false }
					})
				else
					setProfileValidator((validator) => {
						return { ...validator, username: true }
					})
			}
		}
	}
	const handleProfileData = ({ target: { name, value } }) => {
		setFormProfileData((prevState) => ({ ...prevState, [name]: value }))
		if (value.length > 0) {
			setProfileValidator((validator) => {
				return { ...validator, [name]: undefined }
			})
		}
	}

	const [isPasswordSaving, setIsPasswordSaving] = useState(false)
	const [formPasswordData, setFormPasswordData] = useState({
		password: "",
		newPassword: "",
		confirmPassword: "",
	})
	const [passwordValidator, setPasswordValidator] = useState(formPasswordData)
	const handleSavePassword = (e) => {
		e.preventDefault()
		if (!isPasswordSaving) {
			if (
				formPasswordData.password.length &&
				formPasswordData.newPassword.length &&
				formPasswordData.newPassword ===
					formPasswordData.confirmPassword
			) {
				setIsPasswordSaving(true)
				authApi
					.post("/api/users/savePassword", formPasswordData)
					.then(() => {
						setFormPasswordData((formPasswordData) => {
							return {
								...formPasswordData,
								password: "",
								newPassword: "",
								confirmPassword: "",
							}
						})
						setPasswordValidator((validator) => {
							return {
								...validator,
								password: true,
								passwordFeedback: undefined,
								newPassword: true,
								newPasswordFeedback: undefined,
								confirmPassword: true,
								confirmPasswordFeedback: undefined,
							}
						})
					})
					.catch((e) => {
						if (e.response.status === 400) {
							if (e?.response?.data?.error === "Invalid password")
								setPasswordValidator((validator) => {
									return {
										...validator,
										password: false,
										passwordFeedback: "Invalid password",
									}
								})
						} else {
							setPasswordValidator((validator) => {
								return {
									...validator,
									password: false,
									passwordFeedback: "Something went wrong",
									newPassword: false,
									newPasswordFeedback: "Something went wrong",
									confirmPassword: false,
									confirmPasswordFeedback:
										"Something went wrong",
								}
							})
						}
					})
					.finally(() => {
						setIsPasswordSaving(false)
					})
			} else {
				if (!formPasswordData.password.length)
					setPasswordValidator((validator) => {
						return { ...validator, password: false }
					})
				else
					setPasswordValidator((validator) => {
						return { ...validator, password: true }
					})
				if (!formPasswordData.newPassword.length)
					setPasswordValidator((validator) => {
						return { ...validator, newPassword: false }
					})
				else
					setPasswordValidator((validator) => {
						return { ...validator, newPassword: true }
					})
				if (!formPasswordData.confirmPassword.length)
					setPasswordValidator((validator) => {
						return { ...validator, confirmPassword: false }
					})
				else
					setPasswordValidator((validator) => {
						return { ...validator, confirmPassword: true }
					})
				if (
					formPasswordData.newPassword !==
					formPasswordData.confirmPassword
				) {
					setPasswordValidator((validator) => {
						return {
							...validator,
							newPassword: false,
							newPasswordFeedback: "Passwords do not match",
							confirmPassword: false,
							confirmPasswordFeedback: "Passwords do not match",
						}
					})
				}
			}
		}
	}
	const handlePasswordData = ({ target: { name, value } }) => {
		if (passwordValidator[name] === false && value.length > 0) {
			setPasswordValidator((validator) => {
				return { ...validator, [name]: undefined }
			})
		}
		setFormPasswordData((prevState) => ({ ...prevState, [name]: value }))
	}

	return (
		<div className="profile d-block">
			<div className="page-main-heading sticky-top py-2 px-3 mb-3">
				{/* Chat Back Button (Visible only in Small Devices) */}
				<Button
					variant="transparent"
					size="sm"
					className="text-muted d-xl-none border-0"
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</Button>
				<div className="ps-2 ps-xl-0">
					<h5 className="font-weight-semibold">Settings</h5>
					<p className="text-muted mb-0">Manage your profile</p>
				</div>
			</div>
			<Container className="px-2 px-sm-3">
				<Row>
					<Col>
						<Card className="mb-3">
							<Form noValidate onSubmit={handleSaveProfile}>
								<Card.Header>
									<h6 className="mb-1">Account</h6>
									<p className="mb-0 text-muted small">
										Update personal &amp; contact
										information
									</p>
								</Card.Header>
								<Card.Body>
									<Row>
										<Col sm={12} md={6}>
											<Form.Group className="mb-3">
												<label htmlFor="firstName">
													Full Name
												</label>
												<Form.Control
													disabled={isProfileSaving}
													type="text"
													name={"fullname"}
													placeholder={"Full Name"}
													value={
														formProfileData.fullname
													}
													onChange={handleProfileData}
													isInvalid={
														profileValidator.fullname ===
														false
													}
													isValid={
														profileValidator.fullname
													}
												/>
											</Form.Group>
										</Col>
										<Col sm={12} md={6}>
											<Form.Group className="mb-3">
												<label htmlFor="lastName">
													Username
												</label>
												<Form.Control
													disabled={isProfileSaving}
													type="text"
													name={"username"}
													placeholder={"Username"}
													value={
														formProfileData.username
													}
													onChange={handleProfileData}
													isInvalid={
														profileValidator.username ===
														false
													}
													isValid={
														profileValidator.username
													}
												/>
												<Form.Control.Feedback type="invalid">
													{profileValidator.usernameFeedback
														? profileValidator?.usernameFeedback
														: "Username can't be empty"}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col sm={12} md={6}>
											<Form.Group>
												<label htmlFor="mobileNumber">
													Email Address
												</label>
												<Form.Control
													disabled={isProfileSaving}
													type="text"
													name={"email"}
													placeholder={
														"Email Address"
													}
													value={
														formProfileData.email
													}
													onChange={handleProfileData}
													isInvalid={
														profileValidator.email ===
														false
													}
													isValid={
														profileValidator.email
													}
												/>
												<Form.Control.Feedback type="invalid">
													{profileValidator.emailFeedback
														? profileValidator?.emailFeedback
														: "Email can't be empty"}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>
								</Card.Body>
								<Card.Footer className="d-flex justify-content-end">
									<Button
										type="submit"
										disabled={isProfileSaving}
									>
										{!isProfileSaving ? (
											"Save Changes"
										) : (
											<FontAwesomeIcon
												icon={faSpinner}
												spin
											/>
										)}
									</Button>
								</Card.Footer>
							</Form>
						</Card>
						<Card className="mb-3">
							<Form onSubmit={handleSavePassword} noValidate>
								<Card.Header>
									<h6 className="mb-1">Password</h6>
								</Card.Header>
								<Card.Body>
									<Row>
										<Col sm={12} md={6}>
											<Form.Group className="mb-3">
												<label htmlFor="password">
													Current Passwrod
												</label>
												<Form.Control
													disabled={isProfileSaving}
													type="password"
													name={"password"}
													placeholder={
														"Current Password"
													}
													value={
														formPasswordData.password
													}
													onChange={
														handlePasswordData
													}
													isInvalid={
														passwordValidator.password ===
														false
													}
													isValid={
														passwordValidator.password
													}
												/>
												<Form.Control.Feedback type="invalid">
													{passwordValidator.passwordFeedback
														? passwordValidator?.passwordFeedback
														: "Please enter your current password"}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col sm={12} md={6}>
											<Form.Group className="mb-3">
												<label htmlFor="newPassword">
													New Passwrod
												</label>
												<Form.Control
													disabled={isProfileSaving}
													type="password"
													name={"newPassword"}
													placeholder={"New Passwrod"}
													value={
														formPasswordData.newPassword
													}
													onChange={
														handlePasswordData
													}
													isInvalid={
														passwordValidator.newPassword ===
														false
													}
													isValid={
														passwordValidator.newPassword
													}
												/>
												<Form.Control.Feedback type="invalid">
													{passwordValidator.newPasswordFeedback
														? passwordValidator?.newPasswordFeedback
														: "Please enter your new password"}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
										<Col sm={12} md={6}>
											<Form.Group className="mb-3">
												<label htmlFor="confirmPassword">
													Confirm Passwrod
												</label>
												<Form.Control
													disabled={isProfileSaving}
													type="password"
													name={"confirmPassword"}
													placeholder={
														"Confirm Passwrod"
													}
													value={
														formPasswordData.confirmPassword
													}
													onChange={
														handlePasswordData
													}
													isInvalid={
														passwordValidator.confirmPassword ===
														false
													}
													isValid={
														passwordValidator.confirmPassword
													}
												/>
												<Form.Control.Feedback type="invalid">
													{passwordValidator.confirmPasswordFeedback
														? passwordValidator?.confirmPasswordFeedback
														: "Please confirm your new password"}
												</Form.Control.Feedback>
											</Form.Group>
										</Col>
									</Row>
								</Card.Body>
								<Card.Footer className="d-flex justify-content-end">
									<Button
										type="submit"
										disabled={isPasswordSaving}
									>
										{!isPasswordSaving ? (
											"Save Password"
										) : (
											<FontAwesomeIcon
												icon={faSpinner}
												spin
											/>
										)}
									</Button>
								</Card.Footer>
							</Form>
						</Card>
						{/* <div className="card mb-3">
							<div className="card-header">
								<h6 className="mb-1">
									Social network profiles
								</h6>
								<p className="mb-0 text-muted small">
									Update personal &amp; contact information
								</p>
							</div>
							<div className="card-body">
								<Row>
									<Col sm={12} md={6}>
										<Form.Group className="mb-3">
											<label htmlFor="facebookId">
												Facebook
											</label>
											<input
												type="text"
												className="form-control form-control-md"
												id="facebookId"
												placeholder="Username"
											/>
										</Form.Group>
									</Col>
									<Col sm={12} md={6}>
										<Form.Group className="mb-3">
											<label htmlFor="twitterId">
												Twitter
											</label>
											<input
												type="text"
												className="form-control form-control-md"
												id="twitterId"
												placeholder="Username"
											/>
										</Form.Group>
									</Col>
									<Col sm={12} md={6}>
										<Form.Group className="mb-3">
											<label htmlFor="instagramId">
												Instagram
											</label>
											<input
												type="text"
												className="form-control form-control-md"
												id="instagramId"
												placeholder="Username"
											/>
										</Form.Group>
									</Col>
									<Col sm={12} md={6}>
										<Form.Group className="mb-3">
											<label htmlFor="linkedinId">
												Linkedin
											</label>
											<input
												type="text"
												className="form-control form-control-md"
												id="linkedinId"
												placeholder="Username"
											/>
										</Form.Group>
									</Col>
								</Row>
							</div>
							<div className="card-footer d-flex justify-content-end">
								<Button
									as={Link}
									variant="outline-secondary"
									className="text-muted mx-1"
								>
									Reset
								</Button>
								<Button>Save Changes</Button>
							</div>
						</div>
						<div className="card mb-3">
							<div className="card-header">
								<h6 className="mb-1">Privacy</h6>
								<p className="mb-0 text-muted small">
									Update personal &amp; contact information
								</p>
							</div>
							<div className="card-body p-0">
								<ul className="list-group list-group-flush list-group-sm-column">
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">
													Profile Picture
												</p>
												<p className="small text-muted mb-0">
													Select who can see my
													profile picture
												</p>
											</div>
											<Dropdown className="nav-link px-1">
												<Dropdown.Toggle
													as={Button}
													variant=""
													className="dropdown-toggle border-secondary"
												>
													Public&nbsp;
													<FontAwesomeIcon
														icon={faCaretDown}
													/>
												</Dropdown.Toggle>
												<Dropdown.Menu>
													<Dropdown.Item>
														Public
													</Dropdown.Item>
													<Dropdown.Item>
														Friends
													</Dropdown.Item>
													<Dropdown.Item>
														Selected Friends
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</li>
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">
													Last Seen
												</p>
												<p className="small text-muted mb-0">
													Select who can see my last
													seen
												</p>
											</div>
											<Dropdown className="nav-link px-1">
												<Dropdown.Toggle
													as={Button}
													variant=""
													className="dropdown-toggle border-secondary"
												>
													Public&nbsp;
													<FontAwesomeIcon
														icon={faCaretDown}
													/>
												</Dropdown.Toggle>
												<Dropdown.Menu>
													<Dropdown.Item>
														Public
													</Dropdown.Item>
													<Dropdown.Item>
														Friends
													</Dropdown.Item>
													<Dropdown.Item>
														Selected Friends
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</li>
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">Groups</p>
												<p className="small text-muted mb-0">
													Select who can add you in
													groups
												</p>
											</div>
											<Dropdown className="nav-link px-1">
												<Dropdown.Toggle
													as={Button}
													variant=""
													className="dropdown-toggle border-secondary"
												>
													Public&nbsp;
													<FontAwesomeIcon
														icon={faCaretDown}
													/>
												</Dropdown.Toggle>
												<Dropdown.Menu>
													<Dropdown.Item>
														Public
													</Dropdown.Item>
													<Dropdown.Item>
														Friends
													</Dropdown.Item>
													<Dropdown.Item>
														Selected Friends
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</li>
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">Status</p>
												<p className="small text-muted mb-0">
													Select who can see my status
													updates
												</p>
											</div>
											<Dropdown className="nav-link px-1">
												<Dropdown.Toggle
													as={Button}
													variant=""
													className="dropdown-toggle border-secondary"
												>
													Public&nbsp;
													<FontAwesomeIcon
														icon={faCaretDown}
													/>
												</Dropdown.Toggle>
												<Dropdown.Menu>
													<Dropdown.Item>
														Public
													</Dropdown.Item>
													<Dropdown.Item>
														Friends
													</Dropdown.Item>
													<Dropdown.Item>
														Selected Friends
													</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
									</li>
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">
													Read receipts
												</p>
												<p className="small text-muted mb-0">
													If turn off this option you
													won't be able to see read
													recipts
												</p>
											</div>
											<div className="custom-control custom-switch me-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id="readReceiptsSwitch"
													defaultChecked=""
												/>
												<label
													className="custom-control-label"
													htmlFor="readReceiptsSwitch"
												>
													&nbsp;
												</label>
											</div>
										</div>
									</li>
								</ul>
							</div>
							<div className="card-footer d-flex justify-content-end">
								<Button
									as={Link}
									variant="outline-secondary"
									className="text-muted mx-1"
								>
									Reset
								</Button>
								<Button>Save Changes</Button>
							</div>
						</div>
						<div className="card mb-3">
							<div className="card-header">
								<h6 className="mb-1">Security</h6>
								<p className="mb-0 text-muted small">
									Update personal &amp; contact information
								</p>
							</div>
							<div className="card-body p-0">
								<ul className="list-group list-group-flush list-group-sm-column">
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">
													Use two-factor
													authentication
												</p>
												<p className="small text-muted mb-0">
													Ask for a code if attempted
													login from an unrecognised
													device or browser.
												</p>
											</div>
											<div className="custom-control custom-switch me-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id="twoFactorSwitch"
													defaultChecked=""
												/>
												<label
													className="custom-control-label"
													htmlFor="twoFactorSwitch"
												>
													&nbsp;
												</label>
											</div>
										</div>
									</li>
									<li className="list-group-item py-2">
										<div className="media align-items-center">
											<div className="media-body">
												<p className="mb-0">
													Get alerts about
													unrecognised logins
												</p>
												<p className="small text-muted mb-0">
													You will be notified if
													anyone logs in from a device
													or browser you don't usually
													use
												</p>
											</div>
											<div className="custom-control custom-switch me-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id="unrecognisedSwitch"
													defaultChecked=""
												/>
												<label
													className="custom-control-label"
													htmlFor="unrecognisedSwitch"
												>
													&nbsp;
												</label>
											</div>
										</div>
									</li>
								</ul>
							</div>
							<div className="card-footer d-flex justify-content-end">
								<Button
									as={Link}
									variant="outline-secondary"
									className="text-muted mx-1"
								>
									Reset
								</Button>
								<Button>Save Changes</Button>
							</div>
						</div> */}
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default Profile
