import { Form, Input, Button, Card, Avatar, message, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { UseUser } from "../../context/AuthContext";
import { googleLogout } from "@react-oauth/google";
import { axiosPrivate } from "../../lib/axiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { login, logout } from "../../features/user/userSlice";
import AvatarUpload from "../../components/AvatarUpload";

interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const Profile = () => {
	const [form] = Form.useForm();
	const user = useSelector((state: RootState) => state.user.data);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate(); 

	const onFinish = async (values: FormData) => {
		try {
			const {data} = await axiosPrivate.put("/api/user/profile", values);
			dispatch(login(data.profile));
			message.success("Profile updated successfully");
		} catch (error) {
			console.error("Failed to update profile:", error);
			message.error("Failed to update profile");
		}
	};

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

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Card
				style={{ width: 500 }}
				title={
					<Typography.Title level={3}>
						Welcome back{" "}
						<Typography.Title
							level={3}
							italic
							style={{ display: "inline-block" }}
						>
							{user?.name.firstName + " " + user?.name.lastName}
						</Typography.Title>
					</Typography.Title>
				}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginBottom: 20,
					}}
				>
					<AvatarUpload/>
				</div>
				<Form
					form={form}
					name="profile"
					onFinish={onFinish}
					layout="vertical"
					initialValues={{
						firstName: user?.name.firstName,
						lastName: user?.name.lastName,
						email: user?.email,
						_id: user?._id,
					}}
				>
					<Form.Item
						name="firstName"
						label="First Name"
						rules={[
							{
								required: true,
								message: "Please input your first name!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="lastName"
						label="Last Name"
						rules={[
							{
								required: true,
								message: "Please input your last name!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{
								type: "email",
								required: true,
								message: "Please input a valid email!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name={"password"}
						label="Password"
						rules={[
							{
								required: true,
								message: "Please input your password!",
							},
							{
								required: true,
								pattern:
									/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
								message:
									"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
							},
						]}
					>
						<Input.Password placeholder="Password" />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							style={{ width: "100%" }}
						>
							Save
						</Button>
					</Form.Item>
				</Form>
				<Button
					type="default"
					onClick={handleLogout}
					style={{ width: "100%", marginTop: "10px" }}
				>
					Logout
				</Button>
			</Card>
		</div>
	);
};

export default Profile;
