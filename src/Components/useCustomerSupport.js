import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import Cookies from "universal-cookie"
import { io } from "socket.io-client"
import Swal from "sweetalert2"
import { Button, Col, Container, Row, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

const CustomerSupportContent = React.createContext()

export function useCustomerSupport() {
	return useContext(CustomerSupportContent)
}

const CustomerSupportProvider = ({ children, position = "bottom-right" }) => {
	const cookies = new Cookies(null, { path: "/" })
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer)
			toast.addEventListener("mouseleave", Swal.resumeTimer)
		},
	})
	const [Socket, setSocket] = useState(
		io(process.env.REACT_APP_ENV_SERVER_URL, {
			autoConnect: false,
		})
	)
	useEffect(() => {
		setSocket(
			io(process.env.REACT_APP_ENV_SERVER_URL, {
				autoConnect: false,
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const [isOpen, setIsOpen] = useState(
		cookies.get("isCustomerSupportChatOpen") ? true : false
	)
	const [showSupportButton, setShowSupportButton] = useState(!isOpen)

	const toggleChat = () => {
		setIsOpen((isOpen) => {
			if (!isOpen) setShowSupportButton(false)
			else
				setTimeout(() => {
					setShowSupportButton(true)
				}, 500)
			cookies.set("isCustomerSupportChatOpen", !isOpen)
			return !isOpen
		})
	}

	let popupClass = `popup-chat ${position}`

	const api = axios.create({ baseURL: process.env.REACT_APP_ENV_SERVER_URL })

	const [messages, setMessages] = useState([
		{
			text: "Please enter your full name.",
			user: "bot",
			seen: true,
		},
	])
	const [input, setInput] = useState("")

	const handleSend = () => {
		if (input.trim()) {
			const timestamp = new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
			setMessages((messages) => {
				return [
					...messages,
					{ text: input, user: "main", time: timestamp, seen: true },
				]
			})
			setMessages((messages) => {
				return [
					...messages,
					{ text: input, user: "o", time: timestamp, seen: true },
				]
			})
			setInput("")
		}
	}

	const handleInputChange = (e) => {
		setInput(e.target.value)
	}

	return (
		<CustomerSupportContent.Provider value={{ api, Socket, Toast }}>
			{children}
			<div className={popupClass}>
				<Button
					className={`toggle-button ${
						isOpen || !showSupportButton ? "d-none" : ""
					}`}
					onClick={toggleChat}
				>
					Support
				</Button>
				<div
					className={`chat-window-customer ${
						isOpen ? "open" : " close"
					}`}
				>
					{/* Your chat interface component goes here */}
					<div className="chat-header">
						<button className="close-button" onClick={toggleChat}>
							&times;
						</button>
						<h6>Customer Support</h6>
					</div>
					<div className="chat-body">
						<Container className="chat-box">
							<Row className="messages-row">
								<Col>
									<div className="messages">
										{messages.map((message, index) => (
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
										value={input}
										onChange={handleInputChange}
										placeholder="Type a message..."
									/>
								</Col>
								<Col xs="auto">
									<Button onClick={handleSend}>Send</Button>
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</div>
		</CustomerSupportContent.Provider>
	)
}

export default CustomerSupportProvider
