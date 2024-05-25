import { Button } from "react-bootstrap"
import { useMain } from "../Components/useMain"
import { useAuth } from "../Components/useAuth"
const ChatStart = () => {
	const { setShowNewChat } = useMain()
	const { user } = useAuth()
	return (
		<div className="d-flex flex-column justify-content-center text-center h-100 w-100">
			<div className="container">
				{user.avatar ? (
					<div className="avatar avatar-lg mb-2">
						<img className="avatar-img" src={user.avatar} alt="" />
					</div>
				) : (
					<></>
				)}
				<h5>Welcome, {user.fullname}</h5>
				<p className="text-muted">
					Please select a chat to Start messaging.
				</p>
				<Button
					variant="outline-primary"
					onClick={() => setShowNewChat(true)}
				>
					Start a conversation
				</Button>
			</div>
		</div>
	)
}

export default ChatStart
