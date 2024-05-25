// import { LightBoxGallery, GalleryItem } from "react-magnific-popup"
import {
	Button,
	Collapse,
	Dropdown,
	Form,
	InputGroup,
	ListGroup,
	Nav,
} from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faEllipsisVertical,
	faSearch,
	faX,
	faArrowLeft,
	faPaperclip,
	faFile,
	faMailForward,
	faBan,
	faCircleInfo,
	faImage,
	faFileExcel,
	faFilePowerpoint,
	faBookmark,
	faMapLocation,
	faTrash,
	faUnlockKeyhole,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { useAuth } from "../Components/useAuth"
import Preloader from "./Preloader"
import ChatOptions from "../Components/ChatOptions"
import MessageOptions from "../Components/MessageOptions"
import { useChat } from "../Components/useChat"
import { useMain } from "../Components/useMain"
const Chat = () => {
	// const config = {
	// 	delegate: "a",
	// 	type: "image",
	// 	tLoading: "Loading image #%curr%...",
	// 	mainClass: "mfp-img-mobile",
	// 	gallery: {
	// 		enabled: true,
	// 		navigateByImgClick: true,
	// 		preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
	// 	},
	// 	image: {
	// 		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
	// 		titleSrc: function (item) {
	// 			return (
	// 				item.el.attr("title") +
	// 				"<small>by Marsel Van Oosten</small>"
	// 			)
	// 		},
	// 	},
	// }
	const {
		formatDate,
		setShowBlockContact,
		setShowDeleteContact,
		setShowAddContact,
	} = useMain()
	const [messageInput, setMessageInput] = useState({})
	const { id } = useParams()
	const { authApi, user, Socket } = useAuth()
	const { loadedChats, setLoadedChats, setChats, contacts, blocked } =
		useChat()
	const [showSearch, setShowSearch] = useState(false)
	const [showInfo, setShowInfo] = useState(false)
	const [sortedChatsWithDate, setSortedChatsWithDate] = useState()
	const [groupedChatsWithDate, setGroupedChatsWithDate] = useState()
	useEffect(() => {
		if (!loadedChats[id])
			authApi
				.post("/api/message/getMessages", { id })
				.then((response) => {
					setLoadedChats((loadedChats) => {
						return {
							...loadedChats,
							// messages
							[id]: response.data.Messages,
							// chat info (name, avatar, ...)
							["info-" + id]: {
								...loadedChats["info-" + id],
								...response?.data?.OtherUser,
							},
						}
					})
				})
				.catch((e) => {
					if (e?.response?.data?.message)
						switch (e.response.data.message) {
							case "Invalid url":
								console.log(1)
								break
							case "User not found":
								console.log(2)
								break
							default:
						}
					console.log(e.response.data.message)
				})
		else
			setSortedChatsWithDate(
				loadedChats[id].reduce((groups, loadedChatsId) => {
					const date = formatDate(loadedChatsId.createdAt)
					if (!groups[date]) {
						groups[date] = []
					}
					groups[date].push(loadedChatsId)
					return groups
				}, {})
			)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, loadedChats[id]])
	useEffect(() => {
		if (sortedChatsWithDate)
			setGroupedChatsWithDate(
				Object.keys(sortedChatsWithDate).map((date) => {
					return {
						date,
						messages: sortedChatsWithDate[date],
					}
				})
			)
	}, [sortedChatsWithDate, id])
	const sendMessage = () => {
		Socket.emit(
			"sendMessage",
			{ text: messageInput[id], receiver: id },
			(message) => {
				setChats((chats) => {
					return [
						...chats.filter(
							(val) =>
								(val.receiver_user[0]._id !== id &&
									val.sender_user[0]._id !== id) ||
								(id === user._id &&
									val.receiver_user[0]._id !==
										val.sender_user[0]._id)
						),
						{
							...message,
							receiver_user: [message.receiver_user],
							sender_user: [message.sender_user],
						},
					]
				})
				setLoadedChats((loadedChats) => {
					return {
						...loadedChats,
						[id]: [...loadedChats[id], message],
					}
				})
				setMessageInput((messageInput) => {
					return {
						...messageInput,
						[id]: "",
					}
				})
			}
		)
	}
	const contact = contacts.filter((val) => val?.contactUser?.[0]?._id === id)
	const isUserBlocked = blocked.filter(
		(val) => val?.blacklistUser?.[0]?._id === id
	).length
		? true
		: false
	return (
		<div className="chats d-flex">
			{id && loadedChats?.[id] ? (
				<>
					<div className="chat-body">
						{/* Chat Header Start*/}
						<div className="chat-header">
							{/* Chat Back Button (Visible only in Small Devices) */}
							<Link
								to="/chat"
								className="text-muted d-xl-none me-2"
							>
								<FontAwesomeIcon icon={faArrowLeft} />
							</Link>
							{/* Chat participant's Name */}
							<div className="media chat-name align-items-center text-truncate">
								{user._id === id ? (
									<Button
										disabled
										className="opacity-100 rounded-circle me-2"
										variant=""
									>
										<FontAwesomeIcon icon={faBookmark} />
									</Button>
								) : loadedChats["info-" + id]?.avatar ? (
									<div className="avatar /*avatar-online*/ d-none d-sm-inline-block me-3">
										<img
											src={
												loadedChats["info-" + id].avatar
											}
											alt=""
										/>
									</div>
								) : (
									<></>
								)}
								<div className="media-body align-self-center ">
									{loadedChats["info-" + id]?.fullname ||
									user._id === id ? (
										<h6 className="text-truncate mb-0">
											{user._id === id
												? "Saved Messages"
												: loadedChats["info-" + id]
														.fullname}
										</h6>
									) : (
										<></>
									)}
									{/* <small className="text-muted">Online</small> */}
								</div>
							</div>
							{/* Chat Options */}
							<ChatOptions
								setShowSearch={setShowSearch}
								setShowInfo={setShowInfo}
							/>
							{/* Chat Options */}
						</div>
						{/* Chat Header End*/}
						{/* Search Start */}
						<Collapse
							in={showSearch}
							className="border-bottom px-3"
						>
							<div className="container-xl py-2 px-0 px-md-3">
								<InputGroup>
									<Form.Control
										type="text"
										className="form-control form-control-md border-end-0 bg-transparent pe-0"
										placeholder="Search"
									/>
									<InputGroup.Text className="bg-transparent border-start-0">
										<FontAwesomeIcon icon={faSearch} />
									</InputGroup.Text>
								</InputGroup>
							</div>
						</Collapse>
						{/* Search End */}
						{/* Chat Content Start*/}
						<div className="chat-content p-2">
							<div className="container">
								{groupedChatsWithDate ? (
									groupedChatsWithDate.map(
										(group, groupIndex) => {
											return (
												<div
													className="message-day"
													key={groupIndex}
												>
													<div
														className="message-divider sticky-top pb-2"
														data-label={
															formatDate(
																new Date()
															) === group.date
																? "Today"
																: formatDate(
																		new Date().setDate(
																			new Date().getDate() -
																				1
																		)
																  ) ===
																  group.date
																? "Yesterday"
																: group.date
														}
													>
														&nbsp;
													</div>
													{group.messages.map(
														(message, i) => {
															return (
																<div
																	key={i}
																	className={`message ${
																		user._id ===
																		message.sender
																			? "self"
																			: ""
																	}`}
																>
																	<div className="message-wrapper">
																		<div className="message-content">
																			<span>
																				{
																					message.text
																				}
																			</span>
																		</div>
																	</div>
																	<MessageOptions
																		chatId={
																			id
																		}
																		message={
																			message
																		}
																	/>
																</div>
															)
														}
													)}
												</div>
											)
										}
									)
								) : (
									<></>
								)}
								{/* Chat Sample 2 */}
							</div>
							{/* Scroll to finish */}
							<div className="chat-finished" id="chat-finished" />
						</div>
						{/* Chat Content End*/}
						{/* Chat Footer Start*/}
						<div className="chat-footer">
							<div className="attachment">
								<Dropdown className="nav-link px-1">
									<Dropdown.Toggle
										as={Link}
										className="text-secondary"
									>
										<FontAwesomeIcon
											className="m-2 py-1"
											size="2x"
											icon={faPaperclip}
										/>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										<Dropdown.Item disabled>
											<FontAwesomeIcon
												icon={faFile}
												className="me-2"
											/>
											File
										</Dropdown.Item>
										<Dropdown.Item disabled>
											<FontAwesomeIcon
												icon={faImage}
												className="me-2"
											/>
											Photo
										</Dropdown.Item>
										<Dropdown.Item disabled>
											<FontAwesomeIcon
												icon={faMapLocation}
												className="me-2"
											/>
											Location
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<textarea
								className="form-control"
								rows={1}
								value={messageInput[id] ? messageInput[id] : ""}
								onChange={(e) =>
									setMessageInput((messageInput) => {
										return {
											...messageInput,
											[id]: e.target.value,
										}
									})
								}
								placeholder="Type your message here..."
							/>
							<Button
								className="btn-icon send-icon rounded-circle text-light mb-1 opacity-100"
								onClick={sendMessage}
							>
								<FontAwesomeIcon
									className="hw-24"
									icon={faMailForward}
								/>
							</Button>
						</div>
						{/* Chat Footer End*/}
					</div>
					<div
						className={`chat-info ${
							showInfo ? "chat-info-visible" : ""
						}`}
					>
						<div className="d-flex h-100 flex-column">
							{/* Chat Info Header Start */}
							<div className="chat-info-header px-2">
								<div className="container-fluid">
									<Nav className="justify-content-between align-items-center">
										{/* Sidebar Title Start */}
										<li className="text-center">
											<h5 className="text-truncate mb-0">
												Profile Details
											</h5>
										</li>
										{/* Sidebar Title End */}
										{/* Close Sidebar Start */}
										<li
											className="nav-item list-inline-item"
											onClick={() => setShowInfo(false)}
										>
											<Link className="nav-link text-muted px-0">
												<FontAwesomeIcon icon={faX} />
											</Link>
										</li>
										{/* Close Sidebar End */}
									</Nav>
								</div>
							</div>
							{/* Chat Info Header End  */}
							{/* Chat Info Body Start  */}
							<div className="hide-scrollbar flex-fill">
								{/* User Profile Start */}
								<div className="text-center p-3">
									{/* User Profile Picture */}
									{loadedChats["info-" + id]?.avatar ? (
										<div className="avatar avatar-xl mx-5 mb-3">
											<img
												className="avatar-img"
												src={
													loadedChats["info-" + id]
														?.avatar
												}
												alt=""
											/>
										</div>
									) : (
										<></>
									)}
									{/* User Info */}
									<h5 className="mb-3">
										{loadedChats["info-" + id]?.fullname}
									</h5>
									{/* User Quick Options */}
									<div className="d-flex align-items-center justify-content-center">
										<Button
											variant={
												contact.length
													? "warning"
													: "success"
											}
											className="btn-icon rounded-circle mx-1 text-white"
											onClick={() =>
												contact.length
													? setShowDeleteContact(
															contact[0]
													  )
													: setShowAddContact(id)
											}
										>
											<FontAwesomeIcon
												icon={
													contact.length
														? faTrash
														: faUserPlus
												}
											/>
										</Button>
										<Button
											variant={
												isUserBlocked
													? "info"
													: "danger"
											}
											className="btn-icon rounded-circle text-light mx-1"
											onClick={() =>
												setShowBlockContact({
													contact: contact.length
														? contact[0]
														: id,
													isUserBlocked,
												})
											}
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
								{/* User Profile End */}
								{/* User Information Start */}
								<div className="chat-info-group">
									<Link className="chat-info-group-header">
										<h6 className="mb-0">
											User Information
										</h6>
										<FontAwesomeIcon icon={faCircleInfo} />
									</Link>
									<div
										className="chat-info-group-body collapse show"
										id="profile-info"
									>
										<div className="chat-info-group-content list-item-has-padding">
											{/* List Group Start */}
											<ListGroup variant="flush">
												{/* List Group Item Start */}
												<ListGroup.Item className="list-group-item border-0">
													<p className="small text-muted mb-0">
														Username
													</p>
													<p className="mb-0">
														{
															loadedChats[
																"info-" + id
															]?.username
														}
													</p>
												</ListGroup.Item>
												{/* List Group Item End */}
											</ListGroup>
											{/* List Group End */}
										</div>
									</div>
								</div>
								{/* User Information End */}
								{/* Shared Media Start */}
								<div className="chat-info-group">
									<Link className="chat-info-group-header">
										<h6 className="mb-0">Last Media</h6>
										<FontAwesomeIcon icon={faImage} />
									</Link>
									<div
										className="chat-info-group-body collapse show"
										id="shared-media"
									>
										<div className="chat-info-group-content">
											{/* Shared Media */}
											<div className="form-row">
												<div className="col-4 col-md-2 col-xl-4">
													<Link>
														<img
															src={require("../assets/media/shared-photos/01.jpg")}
															className="img-fluid rounded border"
															alt=""
														/>
													</Link>
												</div>
												<div className="col-4 col-md-2 col-xl-4">
													<Link>
														<img
															src={require("../assets/media/shared-photos/02.jpg")}
															className="img-fluid rounded border"
															alt=""
														/>
													</Link>
												</div>
												<div className="col-4 col-md-2 col-xl-4">
													<Link>
														<img
															src={require("../assets/media/shared-photos/03.jpg")}
															className="img-fluid rounded border"
															alt=""
														/>
													</Link>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* Shared Media End */}
								{/* Shared Files Start */}
								<div className="chat-info-group">
									<Link className="chat-info-group-header">
										<h6 className="mb-0">Documents</h6>
										<FontAwesomeIcon icon={faFile} />
									</Link>
									<div
										className="chat-info-group-body collapse show"
										id="shared-files"
									>
										<div className="chat-info-group-content list-item-has-padding">
											{/* List Group Start */}
											<ListGroup
												variant="flush"
												className="py-2"
											>
												{/* List Group Item Start */}
												<ListGroup.Item>
													<div className="document">
														<Button
															disabled
															className="btn-icon rounded-circle text-light me-2 opacity-100"
														>
															<FontAwesomeIcon
																icon={faFile}
															/>
														</Button>
														<div className="document-body">
															<h6 className="text-truncate">
																<Link
																	className="text-reset"
																	title="effects-of-global-warming.docs"
																>
																	Effects-of-global-warming.docs
																</Link>
															</h6>
															<ul className="list-inline small mb-0">
																<li className="list-inline-item">
																	<span className="text-muted">
																		79.2 KB
																	</span>
																</li>
																<li className="list-inline-item">
																	<span className="text-muted text-uppercase">
																		docs
																	</span>
																</li>
															</ul>
														</div>
														<div className="document-options ms-1">
															<Dropdown
																className="nav-link px-1"
																// drop="start"
															>
																<Dropdown.Toggle
																	as={Link}
																	className="text-secondary"
																>
																	<FontAwesomeIcon
																		icon={
																			faEllipsisVertical
																		}
																	/>
																</Dropdown.Toggle>
																<Dropdown.Menu>
																	<Dropdown.Item>
																		Download
																	</Dropdown.Item>
																	<Dropdown.Item>
																		Share
																	</Dropdown.Item>
																	<Dropdown.Item>
																		Delete
																	</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</div>
													</div>
												</ListGroup.Item>
												{/* List Group Item End */}
												{/* List Group Item Start */}
												<ListGroup.Item>
													<div className="document">
														<Button
															disabled
															className="btn-icon rounded-circle text-light me-2 opacity-100"
														>
															<FontAwesomeIcon
																icon={
																	faFileExcel
																}
															/>
														</Button>
														<div className="document-body">
															<h6 className="text-truncate">
																<Link
																	className="text-reset"
																	title="global-warming-data-2020.xlxs"
																>
																	Global-warming-data-2020.xlxs
																</Link>
															</h6>
															<ul className="list-inline small mb-0">
																<li className="list-inline-item">
																	<span className="text-muted">
																		79.2 KB
																	</span>
																</li>
																<li className="list-inline-item">
																	<span className="text-muted text-uppercase">
																		xlxs
																	</span>
																</li>
															</ul>
														</div>
														<div className="document-options ms-1">
															<Dropdown
																className="nav-link px-1"
																// drop="start"
															>
																<Dropdown.Toggle
																	as={Link}
																	className="text-secondary"
																>
																	<FontAwesomeIcon
																		icon={
																			faEllipsisVertical
																		}
																	/>
																</Dropdown.Toggle>
																<Dropdown.Menu>
																	<Dropdown.Item>
																		Download
																	</Dropdown.Item>
																	<Dropdown.Item>
																		Share
																	</Dropdown.Item>
																	<Dropdown.Item>
																		Delete
																	</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</div>
													</div>
												</ListGroup.Item>
												{/* List Group Item End */}
												{/* List Group Item Start */}
												<ListGroup.Item>
													<div className="document">
														<Button
															disabled
															className="btn-icon rounded-circle text-light me-2 opacity-100"
														>
															<FontAwesomeIcon
																icon={
																	faFilePowerpoint
																}
															/>
														</Button>
														<div className="document-body">
															<h6 className="text-truncate">
																<Link
																	className="text-reset"
																	title="great-presentation-on global-warming-2020.ppt"
																>
																	Great-presentation-on
																	global-warming-2020.ppt
																</Link>
															</h6>
															<ul className="list-inline small mb-0">
																<li className="list-inline-item">
																	<span className="text-muted">
																		79.2 KB
																	</span>
																</li>
																<li className="list-inline-item">
																	<span className="text-muted text-uppercase">
																		ppt
																	</span>
																</li>
															</ul>
														</div>
														<div className="document-options ms-1">
															<Dropdown
																className="nav-link px-1"
																// drop="start"
															>
																<Dropdown.Toggle
																	as={Link}
																	className="text-secondary"
																>
																	<FontAwesomeIcon
																		icon={
																			faEllipsisVertical
																		}
																	/>
																</Dropdown.Toggle>
																<Dropdown.Menu>
																	<Dropdown.Item>
																		Download
																	</Dropdown.Item>
																	<Dropdown.Item>
																		Share
																	</Dropdown.Item>
																	<Dropdown.Item>
																		Delete
																	</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</div>
													</div>
												</ListGroup.Item>
												{/* List Group Item End */}
											</ListGroup>
											{/* List Group End */}
										</div>
									</div>
								</div>
								{/* Shared Files End */}
							</div>
							{/* Chat Info Body Start  */}
						</div>
					</div>
				</>
			) : (
				<Preloader />
			)}
		</div>
	)
}

export default Chat
