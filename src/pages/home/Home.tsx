import logoUrl from "../../assets/react.svg";
import { Button, Row, Col } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./styles.css";

const NavigationPage = () => {
	return (
		<div className="container p-4">
			<div className="mb-8">
				<img src={logoUrl} alt="Logo" width={100} height={100} />
			</div>
			<div className="w-fit mb-10">
				<h1 className="typing-text">Welcome to User Management</h1>
			</div>
			<Row gutter={[24, 24]} justify="center" className="w-full max-w-2xl">
				<Col xs={24} sm={12} flex={"none"}>
					<Link to="/dashboard">
						<Button type="primary" size="large" icon={<UserOutlined />}>
							User
						</Button>
					</Link>
				</Col>
				<Col xs={24} sm={12} flex={"none"}>
					<Link to="/admin">
						<Button type="primary" size="large" icon={<TeamOutlined />}>
							Admin
						</Button>
					</Link>
				</Col>
			</Row>
		</div>
	);
};

export default NavigationPage;
