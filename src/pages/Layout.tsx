import { Link, Outlet } from "react-router-dom";
import React from "react";
import { Avatar, Dropdown, Layout, Menu, theme, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { logout } from "../features/user/userSlice";
import { axiosPrivate } from "../lib/axiosPrivate";

const { Header, Content } = Layout;

const UserLayout: React.FC = () => {
	const user = useSelector((state: RootState) => state.user.data);
	const dispatch = useDispatch<AppDispatch>();

	const items =
		user?.role === "admin"
			? [
					{ key: "user", label: <Link to={"/admin/user"}>User</Link> },
					{ key: "profile", label: <Link to={"/admin"}>Profile</Link> },
					{
						key: "create-user",
						label: <Link to={"/admin/create-user"}>User Creation</Link>,
					},
			  ]
			: [];

	const navigate = useNavigate();

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const handleLogout = async () => {
		try {
			await axiosPrivate.post("/api/auth/logout");
			dispatch(logout());
			googleLogout();
			message.success("Logged out successfully");
			navigate("/login");
		} catch (error) {
			console.error("Failed to log out:", error);
			message.error("Failed to log out");
		}
	};

	const dropDown = [
		{
			key: 1,
			label: (
				<Button icon={<LogoutOutlined />} onClick={handleLogout}>
					Logout
				</Button>
			),
		},
	];

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
				<Dropdown trigger={["click"]} menu={{ items: dropDown }}>
					<div style={{ marginInline: "1rem" }}>
						<Avatar
							style={{ background: colorBgContainer }}
							icon={<img src={`${user?.avatar}`} /> || <UserOutlined />}
							size={40}
						/>
					</div>
				</Dropdown>
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
