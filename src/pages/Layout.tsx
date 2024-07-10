import { Link, Outlet } from "react-router-dom";
import React from "react";
import { Layout, Menu, theme } from "antd";

const { Header, Content } = Layout;

const items = [
	{ key: "user", label: <Link to={"/admin/user"}>User</Link> },
	{ key: "profile", label: <Link to={"/admin"}>Profile</Link> },
	{ key: "create-user", label: <Link to={"/admin/create-user"}>User Creation</Link> },
];

const App: React.FC = () => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout style={{ height: "100vh" }}>
			<Header style={{ display: "flex", alignItems: "center" }}>
				<div className="demo-logo"/>
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={["2"]}
					items={items}
					style={{ flex: 1, minWidth: 0 }}
				/>
			</Header>
			<Content /* style={{ padding: "0 48px" }} */>
				<div
					style={{
						background: colorBgContainer,
						minHeight: "100%",
						// padding: 24,
						borderRadius: borderRadiusLG,
					}}
				>
					<Outlet />
				</div>
			</Content>
		</Layout>
	);
};

export default App;
