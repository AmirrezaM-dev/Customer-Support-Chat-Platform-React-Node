import React, { useState, useRef, useEffect } from "react"
import {
	Form,
	InputGroup,
	ListGroup,
	Badge,
	Dropdown,
	Button,
	Row,
	Col,
	Container,
} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	faBars,
	faTimes,
	faWindowMinimize,
	faExpand,
	faCompress,
	faCheck,
	faBan,
	faThumbtack,
	faBellSlash,
	faRightFromBracket,
	faEye,
} from "@fortawesome/free-solid-svg-icons"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

const ChatList = () => {
	const IconWithSlash = ({ icon, slash }) => {
		return (
			<div className={`icon-wrapper ${slash ? "slash" : ""}`}>
				<FontAwesomeIcon icon={icon} className="fa" />
				{slash && <span className="fa-slash" />}
			</div>
		)
	}

	const toggleButtonRef = useRef()
	const [isSideNavVisible, setIsSideNavVisible] = useState(false)
	const [chatItems, setChatItems] = useState([
		{
			name: "Alice",
			lastMessage: "Hey, how are you?",
			time: "2:45 PM",
			online: true,
			unseenMessages: 2,
			isNavVisible: false,
			isOpen: false,
			date: 1716815415312 + 2000,
			order: 2,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
			isNavVisible: false,
			isOpen: false,
			date: 1716815415312 + 1000,
			order: 1,
		},
		{
			name: "Charlie",
			lastMessage: "See you soon!",
			time: "12:15 PM",
			online: true,
			unseenMessages: 1,
			isNavVisible: false,
			isOpen: false,
			date: 1716815415312,
			order: 0,
		},
		// Add more chat items as needed
	])

	const openChat = (index) => {
		setChatItems((prevChatItems) => {
			const maxOrderItem = prevChatItems.reduce(
				(maxItem, currentItem) => {
					return currentItem.isOpen
						? currentItem.order > maxItem.order
							? currentItem
							: maxItem
						: maxItem
				},
				{ order: -1 }
			)

			return prevChatItems
				.sort((a, b) => b.date - a.date)
				.map((item, i) => {
					return i === index
						? {
								...item,
								isOpen: true,
								isMinimized: false,
								isClosed: false,
								order:
									maxOrderItem.order === item.order
										? item.order
										: maxOrderItem.order + 1,
						  }
						: item
				})
		})
	}

	useEffect(() => {
		if (chatItems.some((_) => _?.isOpen === false && _?.isClosed === false))
			setChatItems((chatItems) => {
				return chatItems
					.sort((a, b) => b.date - a.date)
					.map((_) => {
						return _?.isOpen === false ? { ..._, isOpen: true } : _
					})
			})
	}, [chatItems])

	const toggleFullScreenChat = (index) => {
		setChatItems((prevChatItemses) =>
			prevChatItemses.map((chat, i) => ({
				...chat,
				isFullScreen: i === index ? !chat.isFullScreen : false,
			}))
		)
	}

	const closeChat = (index) => {
		setChatItems((prevChatItemses) => {
			const updatedChatItemses = [...prevChatItemses]
			updatedChatItemses[index].isOpen = false
			updatedChatItemses[index].isClosed = true
			updatedChatItemses[index].changeOrderTo = 0
			return updatedChatItemses
		})
	}

	const toggleMinimizeChat = (index) => {
		setChatItems((prevChatItemses) => {
			const updatedChatItemses = [...prevChatItemses]
			updatedChatItemses[index].isMinimized =
				!updatedChatItemses[index].isMinimized
			return updatedChatItemses
		})
	}

	const toggleNavVisibility = (index) => {
		setChatItems((prevChatItemses) => {
			const updatedChatItemses = [...prevChatItemses]
			updatedChatItemses[index].isNavVisible =
				!updatedChatItemses[index].isNavVisible
			return updatedChatItemses
		})
	}

	const onDragEnd = (result) => {
		if (!result.destination) return

		const updatedChatItems = Array.from(chatItems)
		const [reorderedItem] = updatedChatItems.splice(result.source.index, 1)
		updatedChatItems.splice(result.destination.index, 0, reorderedItem)
		// Update the order based on the new index
		const reorderedChatItems = updatedChatItems.map((item, index) => ({
			...item,
			order: chatItems.length - index - 1,
		}))

		setChatItems(reorderedChatItems)
	}

	return (
		<div className="chat-app-container">
			<Button
				className={`p-0 px-2 side-nav-toggle ${
					isSideNavVisible ? "open" : "shadow"
				}`}
				onClick={() => setIsSideNavVisible(!isSideNavVisible)}
				variant={isSideNavVisible ? "link" : "secondary"}
			>
				<FontAwesomeIcon icon={isSideNavVisible ? faTimes : faBars} />
			</Button>
			<div
				className={`side-nav ${
					isSideNavVisible ? "visible" : "hidden"
				}`}
			>
				<div className="search-menu-container p-3">
					<InputGroup>
						<Form.Control
							placeholder="Search..."
							aria-label="Search"
						/>
						<InputGroup.Text
							className="cursor-pointer"
							onClick={() => toggleButtonRef?.current?.click()}
						>
							<Dropdown alignRight>
								<Dropdown.Toggle
									variant="link"
									className="p-0 custom-dropdown-toggle"
									ref={toggleButtonRef}
								>
									<FontAwesomeIcon icon={faBars} />
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item>Logout</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</InputGroup.Text>
					</InputGroup>
				</div>

				<ListGroup className="chat-list" variant="flush">
					{chatItems
						.sort((a, b) => b.date - a.date)
						.map((chat, index) => (
							<ListGroup.Item
								key={index}
								className="d-flex justify-content-between align-items-center"
								onClick={() => openChat(index)}
							>
								<div className="chat-info">
									<div className="d-flex align-items-center">
										<span className="chat-name">
											{chat.name}
										</span>
										{chat.online && (
											<span className="online-status"></span>
										)}
									</div>
									<div className="last-message">
										{chat.lastMessage}
									</div>
								</div>
								<div className="chat-meta">
									<div className="time">{chat.time}</div>
									{chat.unseenMessages > 0 && (
										<Badge variant="primary">
											{chat.unseenMessages}
										</Badge>
									)}
								</div>
							</ListGroup.Item>
						))}
				</ListGroup>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="chatBoxContainer"
					direction="horizontal"
				>
					{(provided) => (
						<div
							className={`chat-box-container pb-5 ${
								isSideNavVisible ? "with-nav" : "without-nav"
							}`}
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							<Row className="chat-box-row px-2 pb-3 mx-0">
								{chatItems
									.sort((a, b) => b.order - a.order)
									.map((chat, index) => (
										<Draggable
											key={chat.name}
											draggableId={chat.name}
											index={index}
										>
											{(provided) => (
												<Col
													xl={
														chat.isFullScreen
															? "12"
															: "4"
													}
													lg={
														chat.isFullScreen
															? "12"
															: "6"
													}
													md="12"
													className={`px-0 chat-box-wrapper ${
														!chat.isOpen ||
														chat.isMinimized
															? "removing"
															: ""
													}`}
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={{
														...provided
															.draggableProps
															.style,
														transitionDuration:
															"0ms", // Disable animation
													}}
												>
													<div
														className={`chat-window ${
															!chat.isOpen ||
															chat.isMinimized
																? "removing"
																: ""
														} ${
															chat.isFullScreen
																? "full-screen"
																: ""
														}`}
													>
														<div className="chat-header d-flex justify-content-between align-items-center">
															<span>
																{chat.name}
															</span>
															<div>
																<Button
																	variant="link"
																	onClick={() =>
																		toggleNavVisibility(
																			index
																		)
																	}
																>
																	<FontAwesomeIcon
																		icon={
																			faBars
																		}
																	/>
																</Button>
																<Button
																	variant="link"
																	onClick={() =>
																		toggleMinimizeChat(
																			index
																		)
																	}
																>
																	<FontAwesomeIcon
																		icon={
																			faWindowMinimize
																		}
																	/>
																</Button>
																<Button
																	variant="link"
																	onClick={() =>
																		toggleFullScreenChat(
																			index
																		)
																	}
																>
																	<FontAwesomeIcon
																		icon={
																			chat.isFullScreen
																				? faCompress
																				: faExpand
																		}
																	/>
																</Button>
																<Button
																	variant="link"
																	onClick={() =>
																		closeChat(
																			index
																		)
																	}
																>
																	<FontAwesomeIcon
																		icon={
																			faTimes
																		}
																	/>
																</Button>
															</div>
														</div>
														<div
															className={`chat-nav d-flex justify-content-center align-items-center ${
																chat.isNavVisible
																	? ""
																	: "removing"
															}`}
														>
															<Button
																variant="link"
																className="text-dark"
															>
																<FontAwesomeIcon
																	icon={faEye}
																/>
															</Button>
															<Button
																variant="link"
																className="text-dark"
															>
																<IconWithSlash
																	icon={
																		faThumbtack
																	}
																	slash={true}
																/>
															</Button>
															<Button
																variant="link"
																className="text-dark"
															>
																<FontAwesomeIcon
																	icon={
																		faBellSlash
																	}
																/>
															</Button>
															<Button
																variant="link"
																className="text-dark"
															>
																<FontAwesomeIcon
																	icon={
																		faRightFromBracket
																	}
																/>
															</Button>
															<Button
																variant="link"
																className="text-dark"
															>
																<FontAwesomeIcon
																	icon={faBan}
																/>
															</Button>
														</div>
														<div
															className="chat-body"
															style={{
																height: chat.isNavVisible
																	? "calc(100% - 104px)"
																	: "calc(100% - 50px)",
															}}
														>
															<Container className="chat-box">
																<Row className="messages-row">
																	<Col>
																		<div className="messages">
																			{chat?.messages?.map(
																				(
																					message,
																					index
																				) => (
																					<div
																						key={
																							index
																						}
																						className={`message ${
																							message.user ===
																							"main"
																								? "main-user"
																								: "other-user"
																						}`}
																					>
																						{
																							message.text
																						}
																						<div className="message-info">
																							<span className="timestamp">
																								{
																									message.time
																								}
																							</span>
																							{message.user ===
																								"main" &&
																								message.seen && (
																									<FontAwesomeIcon
																										icon={
																											faCheck
																										}
																										className="seen-icon text-white"
																									/>
																								)}
																						</div>
																					</div>
																				)
																			)}
																		</div>
																	</Col>
																</Row>
																<Row className="input-row">
																	<Col>
																		<Form.Control
																			type="text"
																			placeholder="Type a message..."
																		/>
																	</Col>
																	<Col xs="auto">
																		<Button>
																			Send
																		</Button>
																	</Col>
																</Row>
															</Container>
														</div>
													</div>
												</Col>
											)}
										</Draggable>
									))}
								{provided.placeholder}
							</Row>
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<div
				className={`chat-bar ${
					isSideNavVisible ? "with-nav" : "without-nav"
				}`}
			>
				{chatItems
					.sort((a, b) => b.order - a.order)
					.map((chat, index) => (
						<div
							key={index}
							className={`minimized-chat-item ${
								!chat.isOpen ? "removing" : "cursor-pointer"
							}  pe-0 ${
								chat.isMinimized ? "" : "bg-primary text-white"
							}`}
							onClick={(e) => {
								if (chat.isOpen && e.target.nodeName === "DIV")
									toggleMinimizeChat(index)
							}}
						>
							<div>{chat.name}</div>
							<Button
								variant="link"
								className={`ms-2 me-0 ${
									chat.isMinimized ? "" : "text-white"
								}`}
								onClick={() => closeChat(index)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</Button>
						</div>
					))}
			</div>
		</div>
	)
}

export default ChatList
