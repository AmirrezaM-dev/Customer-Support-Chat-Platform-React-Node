import ReactDOM from "react-dom/client"
import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App"
import { HashRouter as Router } from "react-router-dom"
import CustomerSupportProvider from "./Components/useCustomerSupport"
import React from "react"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	// <React.StrictMode>
	<Router>
		<CustomerSupportProvider>
			<App />
		</CustomerSupportProvider>
	</Router>
	// </React.StrictMode>
)
