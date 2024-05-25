import {
	faArrowLeft,
	faBan,
	faEllipsisVertical,
	faMessage,
	faSignature,
	faTrash,
	faUnlockKeyhole,
	faUserAlt,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Dropdown } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useChat } from "../Components/useChat"
import { useMain } from "../Components/useMain"
const Contacts = () => {
	const navigate = useNavigate()
	const { setShowDeleteContact, setShowBlockContact } = useMain()
	const { contacts, blocked } = useChat()
	const { id } = useParams()
	const contact = contacts
		? contacts.filter((val) => val._id === id).length
			? contacts.filter((val) => val._id === id)[0]
			: undefined
		: undefined
	const isUserBlocked = blocked.filter(
		(val) => val?.blacklistUser?.[0]?._id === contact?.contactUser?.[0]?._id
	).length
		? true
		: false
	return id && contacts.filter((val) => val._id === id).length ? (
		<div className="friends px-0 py-2 p-xl-3 d-block">
			<div className="container-xl">
				<div className="row">
					<div className="col">
						<div className="card card-body card-bg-1 mb-3">
							<div className="d-flex flex-column align-items-center">
								{contact?.contactUser?.[0]?.avatar ? (
									<div className="avatar avatar-lg mb-3">
										<img
											className="avatar-img"
											src={contact.contactUser[0].avatar}
											alt=""
										/>
									</div>
								) : (
									<></>
								)}
								<div className="d-flex flex-column align-items-center">
									{contact?.fullname ? (
										<h5 className="mb-1">
											{contact.fullname}
										</h5>
									) : (
										<></>
									)}
									{/* <p class="text-white rounded px-2 bg-primary">+01-202-265462</p> */}
									<div className="d-flex mt-2">
										<Button
											className="btn-icon rounded-circle text-light mx-2"
											onClick={() =>
												navigate(
													"/chat/" +
														contact?.contactUser[0]
															?._id
												)
											}
										>
											<FontAwesomeIcon icon={faMessage} />
										</Button>
										<Button
											variant="warning"
											className="btn-icon rounded-circle text-light mx-2"
											onClick={() => {
												setShowDeleteContact(contact)
											}}
										>
											<FontAwesomeIcon icon={faTrash} />
										</Button>
										<Button
											variant={
												isUserBlocked
													? "info"
													: "danger"
											}
											className="btn-icon rounded-circle text-light mx-2"
											onClick={() => {
												setShowBlockContact({
													contact,
													isUserBlocked,
												})
											}}
										>
											<FontAwesomeIcon
												icon={
													isUserBlocked
														? faUnlockKeyhole
														: faBan
												}
											/>
										</Button>
									</div>
								</div>
							</div>
							<div className="card-options">
								<Dropdown>
									<Dropdown.Toggle
										as={Button}
										size="sm"
										variant="secondary"
										className="btn-icon btn-minimal text-muted border-0"
									>
										<FontAwesomeIcon
											icon={faEllipsisVertical}
										/>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<Dropdown.Item
											onClick={() =>
												setShowDeleteContact(contact)
											}
										>
											Remove
										</Dropdown.Item>
										<Dropdown.Item
											onClick={() => {
												setShowBlockContact({
													contact,
													isUserBlocked,
												})
											}}
										>
											{isUserBlocked
												? "Unblock"
												: "Block"}
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="chat-closer d-xl-none">
								{/* Chat Back Button (Visible only in Small Devices) */}
								<Button
									variant="secondary"
									size="sm"
									className="btn-icon btn-minimal text-muted border-0"
									onClick={() => navigate("/contacts")}
								>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="row friends-info">
					<div className="col">
						<div className="card">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<div className="media align-items-center">
										<div className="media-body">
											<p className="small text-muted mb-0">
												Fullname
											</p>
											<p className="mb-0">
												{
													contact.contactUser[0]
														.fullname
												}
											</p>
										</div>
										<FontAwesomeIcon icon={faSignature} />
									</div>
								</li>
								<li className="list-group-item">
									<div className="media align-items-center">
										<div className="media-body">
											<p className="small text-muted mb-0">
												Username
											</p>
											<p className="mb-0">
												{
													contact.contactUser[0]
														.username
												}
											</p>
										</div>
										<FontAwesomeIcon icon={faUserAlt} />
									</div>
								</li>
							</ul>
						</div>
						{/* <div className="card">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<div className="media align-items-center">
										<div className="media-body">
											<p className="small text-muted mb-0">
												Facebook
											</p>
											<Link className="font-size-sm font-weight-medium">
												@cathe.richardson
											</Link>
										</div>
										<svg
											className="text-muted hw-20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
										</svg>
									</div>
								</li>
							</ul>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	)
}

export default Contacts
