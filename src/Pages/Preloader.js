import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Preloader = () => {
	return (
		<div className="d-flex flex-column justify-content-center text-center h-100 w-100">
			<div className="container">
				<FontAwesomeIcon
					icon={faSpinner}
					spin
					size="10x"
					className="avatar-img"
				/>
			</div>
		</div>
	)
}

export default Preloader
