import React, { useState, useRef, useCallback } from "react"
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
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const IconWithSlash = ({ icon, slash }) => {
	return (
		<div className={`icon-wrapper ${slash ? "slash" : ""}`}>
			<FontAwesomeIcon icon={icon} className="fa" />
			{slash && <span className="fa-slash" />}
		</div>
	)
}

const ChatBox = ({
	chat,
	index,
	moveChatBox,
	toggleMinimizeChat,
	toggleFullScreenChat,
	closeChat,
	setHoveredChatIndex,
	hoveredChatIndex,
}) => {
	const [isNavVisible, setIsNavVisible] = useState(false)
	const ref = useRef(null)

	const ItemTypes = {
		CHAT_BOX: "chatBox",
	}

	const [, drop] = useDrop({
		accept: ItemTypes.CHAT_BOX,
		hover(item, monitor) {
			if (!ref.current) return

			const dragIndex = item.index
			const hoverIndex = index

			if (dragIndex === hoverIndex) return

			const hoverBoundingRect = ref.current?.getBoundingClientRect()
			const hoverMiddleY =
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
			const clientOffset = monitor.getClientOffset()
			const hoverClientY = clientOffset.y - hoverBoundingRect.top

			if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY * 0.2) {
				moveChatBox(dragIndex, hoverIndex)
				item.index = hoverIndex
				setHoveredChatIndex(hoverIndex)
			} else if (
				dragIndex > hoverIndex &&
				hoverClientY < hoverMiddleY * 1.8
			) {
				moveChatBox(dragIndex, hoverIndex)
				item.index = hoverIndex
				setHoveredChatIndex(hoverIndex)
			}
		},
		drop() {
			setHoveredChatIndex(null)
		},
	})

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.CHAT_BOX,
		item: { type: ItemTypes.CHAT_BOX, index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		end() {
			setHoveredChatIndex(null)
		},
	})

	drag(drop(ref))

	return (
		<Col xl="4" lg="6" md="12" className="px-0">
			<div
				ref={ref}
				className={`chat-window ${
					chat.isFullScreen ? "full-screen" : ""
				} ${isDragging ? "dragging" : ""} ${
					hoveredChatIndex === index ? "hovered" : ""
				}`}
				style={{ opacity: isDragging ? 0.5 : 1 }}
			>
				<div className="chat-header d-flex justify-content-between align-items-center">
					<span>{chat.name}</span>
					<div>
						<Button
							variant="link"
							onClick={() => setIsNavVisible(!isNavVisible)}
						>
							<FontAwesomeIcon icon={faBars} />
						</Button>
						<Button
							variant="link"
							onClick={() => toggleMinimizeChat(index)}
						>
							<FontAwesomeIcon icon={faWindowMinimize} />
						</Button>
						<Button
							variant="link"
							onClick={() => toggleFullScreenChat(index)}
						>
							<FontAwesomeIcon
								icon={chat.isFullScreen ? faCompress : faExpand}
							/>
						</Button>
						<Button
							variant="link"
							onClick={() => closeChat(chat.index)}
						>
							<FontAwesomeIcon icon={faTimes} />
						</Button>
					</div>
				</div>
				{isNavVisible && (
					<div className="chat-nav d-flex justify-content-center align-items-center">
						<Button variant="link" className="text-dark">
							<FontAwesomeIcon icon={faEye} />
						</Button>
						<Button variant="link" className="text-dark">
							<IconWithSlash icon={faThumbtack} slash={true} />
						</Button>
						<Button variant="link" className="text-dark">
							<FontAwesomeIcon icon={faBellSlash} />
						</Button>
						<Button variant="link" className="text-dark">
							<FontAwesomeIcon icon={faRightFromBracket} />
						</Button>
						<Button variant="link" className="text-dark">
							<FontAwesomeIcon icon={faBan} />
						</Button>
					</div>
				)}
				<div
					className="chat-body"
					style={{
						height: isNavVisible
							? "calc(100% - 104px)"
							: "calc(100% - 50px)",
					}}
				>
					<Container className="chat-box">
						<Row className="messages-row">
							<Col>
								<div className="messages">
									{chat?.messages?.map((message, index) => (
										<div
											key={index}
											className={`message ${
												message.user === "main"
													? "main-user"
													: "other-user"
											}`}
										>
											{message.text}
											<div className="message-info">
												<span className="timestamp">
													{message.time}
												</span>
												{message.user === "main" &&
													message.seen && (
														<FontAwesomeIcon
															icon={faCheck}
															className="seen-icon text-white"
														/>
													)}
											</div>
										</div>
									))}
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
								<Button>Send</Button>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		</Col>
	)
}

const ChatList = () => {
	const toggleButtonRef = useRef()
	const [chatBoxes, setChatBoxes] = useState([])
	const [hoveredChatIndex, setHoveredChatIndex] = useState(null)
	const [isSideNavVisible, setIsSideNavVisible] = useState(false)

	const chatItems = [
		{
			name: "Alice",
			lastMessage: "Hey, how are you?",
			time: "2:45 PM",
			online: true,
			unseenMessages: 2,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
		},
		{
			name: "Bob",
			lastMessage: "Let's catch up later.",
			time: "1:30 PM",
			online: false,
			unseenMessages: 0,
		},
	]

	const openChat = (index, fromMinimizedBar = false) => {
		const chatIndex = chatBoxes.findIndex((c) => c.index === index)
		const isAnyFullScreen = chatBoxes.some(
			(chat) => chat.isFullScreen && !chat.isMinimized
		)

		if (chatIndex === -1) {
			const newChatBox = {
				...chatItems[index],
				isMinimized: false,
				isFullScreen: isAnyFullScreen,
				index,
			}
			setChatBoxes([...chatBoxes, newChatBox])
		} else {
			const updatedChatBoxes = [...chatBoxes]
			updatedChatBoxes[chatIndex].isMinimized = false
			if (isAnyFullScreen && !updatedChatBoxes[chatIndex].isFullScreen) {
				updatedChatBoxes.forEach((chat) => (chat.isFullScreen = false))
				updatedChatBoxes[chatIndex].isFullScreen = true
			}

			if (!fromMinimizedBar) {
				const [chat] = updatedChatBoxes.splice(chatIndex, 1)
				setChatBoxes([chat, ...updatedChatBoxes])
			} else {
				setChatBoxes(updatedChatBoxes)
			}
		}
	}

	const toggleFullScreenChat = (index) => {
		const updatedChatBoxes = chatBoxes.map((chat, i) => ({
			...chat,
			isFullScreen: i === index ? !chat.isFullScreen : false,
		}))
		setChatBoxes(updatedChatBoxes)
	}

	const closeChat = (index) => {
		setChatBoxes(chatBoxes.filter((chat) => chat.index !== index))
	}

	const toggleMinimizeChat = (index) => {
		const updatedChatBoxes = [...chatBoxes]
		updatedChatBoxes[index].isMinimized =
			!updatedChatBoxes[index].isMinimized
		setChatBoxes(updatedChatBoxes)
	}

	const moveChatBox = useCallback(
		(dragIndex, hoverIndex) => {
			const draggedChatBox = chatBoxes[dragIndex]
			const updatedChatBoxes = [...chatBoxes]
			updatedChatBoxes.splice(dragIndex, 1)
			updatedChatBoxes.splice(hoverIndex, 0, draggedChatBox)
			setChatBoxes(updatedChatBoxes)
		},
		[chatBoxes]
	)

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="chat-app-container">
				<Button
					className={`p-0 px-2 side-nav-toggle ${
						isSideNavVisible ? "open" : "shadow"
					}`}
					onClick={() => setIsSideNavVisible(!isSideNavVisible)}
					variant={isSideNavVisible ? "link" : "secondary"}
				>
					<FontAwesomeIcon
						icon={isSideNavVisible ? faTimes : faBars}
					/>
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
								onClick={() =>
									toggleButtonRef?.current?.click()
								}
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
						{chatItems.map((chat, index) => (
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

				<div
					className={`chat-box-container pb-5 ${
						isSideNavVisible ? "with-nav" : "without-nav"
					}`}
				>
					<Row className="chat-box-row px-2 pb-3 mx-0">
						{chatBoxes.map((chat, index) =>
							!chat.isMinimized ? (
								<ChatBox
									key={index}
									chat={chat}
									index={index}
									moveChatBox={moveChatBox}
									toggleMinimizeChat={toggleMinimizeChat}
									toggleFullScreenChat={toggleFullScreenChat}
									closeChat={closeChat}
									setHoveredChatIndex={setHoveredChatIndex}
									hoveredChatIndex={hoveredChatIndex}
								/>
							) : (
								<></>
							)
						)}
					</Row>
				</div>

				<div
					className={`chat-bar ${
						isSideNavVisible ? "with-nav" : "without-nav"
					}`}
				>
					{chatBoxes.map((chat, index) => (
						<div
							key={index}
							className={`minimized-chat-item cursor-pointer pe-0 ${
								chat.isMinimized ? "" : "bg-primary text-white"
							}`}
							onClick={(e) => {
								if (e.target.nodeName === "DIV")
									chat.isMinimized
										? openChat(chat.index, true)
										: toggleMinimizeChat(index)
							}}
						>
							<div>{chat.name}</div>
							<Button
								variant="link"
								className={`ms-2 me-0 ${
									chat.isMinimized ? "" : "text-white"
								}`}
								onClick={() => closeChat(chat.index)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</Button>
						</div>
					))}
				</div>
			</div>
		</DndProvider>
	)
}

export default ChatList
