
import { Link } from "react-router-dom"
import { Row, Col } from "react-bootstrap"
const Footer = () => {
	return (
		<div className="footer">
			<div className="container">
				<Row className="align-items-center flex-row-reverse">
					<Col className="text-center" sm={12} md={12} lg={12}>
						Magicine Pharma © Copyright 2024 | Developed By - <Link to="https://bytelogicindia.com/">Bytelogic Technologies</Link>
					</Col>
				</Row>
			</div>
		</div>

	);
}

export default Footer;
