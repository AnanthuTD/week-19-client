import { Link, Outlet } from "react-router-dom";
import React from "react";
import { Avatar, Layout, Menu, theme } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { UserOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const items = [
	{ key: "profile", label: <Link to={"/user/dashboard"}>Profile</Link> },
];

const UserLayout: React.FC = () => {
	const user = useSelector((state: RootState) => state.user.data);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout style={{ height: "100vh" }}>
			<Header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: 0,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						width: "-webkit-fill-available",
					}}
				>
					{/* <div className="demo-logo">Logo</div> */}
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={["2"]}
						items={items}
						style={{ flex: 1, minWidth: 0 }}
					/>
				</div>
				<div style={{ marginInline: "1rem" }}>
					<Avatar style={{background: colorBgContainer}}
						icon={
							<img src={`${user?.avatar}`} /> || <UserOutlined />
						}
					/>
				</div>
			</Header>
			<Content>
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

export default UserLayout;
