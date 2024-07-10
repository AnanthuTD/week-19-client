import { Form, Input, Button, Card, message, Typography } from "antd";
import { axiosPrivate } from "../lib/axiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { login } from "../features/user/userSlice";
import AvatarUpload from "../components/AvatarUpload";

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

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				// height: "100vh",
				paddingTop: '2rem'
			}}
		>
			<Card
				style={{ width: 500 }}
				title={
					<Typography.Text>
						Welcome back{" "}
						<Typography.Text
							italic
							style={{ display: "inline-block" }}
						>
							{user?.name.firstName + " " + user?.name.lastName}
						</Typography.Text>
					</Typography.Text>
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
								// required: true,
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
						label="New Password"
						rules={[
							{
								// required: true,
								message: "Please input your password!",
							},
							{
								// required: true,
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
			</Card>
		</div>
	);
};

export default Profile;
