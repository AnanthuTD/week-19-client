import {
	Form,
	Input,
	Button,
	Card,
	Typography,
	message,
	Alert,
	Select,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { axiosPrivate } from "../../lib/axiosPrivate";

const { Title } = Typography;
interface SignUpError {
	msg?: string;
	code?: string;
	error?: boolean;
}
interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: "admin" | "user";
}

const CreateUser = () => {
	const [error, setError] = useState<SignUpError | null>(null);
	const onFinish = async (values: FormData) => {
		try {
			await axiosPrivate.post("/api/auth/sign-up", values);
			message.success("Signed up successfully! Please login");
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error?.response.data);
			} else setError({ msg: "Unknown Error" });
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Card
				style={{ width: 400, padding: "24px", borderRadius: "8px" }}
				title={<Title level={2}>Create User</Title>}
			>
				<Form name="create-user" onFinish={onFinish}>
					<Form.Item name={"role"} initialValue={"user"} required>
						<Select
							options={[
								{ value: "admin", label: "Admin" },
								{ value: "user", label: "User" },
							]}
						/>
					</Form.Item>
					<Form.Item
						name="firstName"
						rules={[
							{
								required: true,
								message: "Please enter your first name!",
							},
						]}
					>
						<Input placeholder="First Name" />
					</Form.Item>

					<Form.Item
						name="lastName"
						rules={[
							{
								required: true,
								message: "Please enter your last name!",
							},
						]}
					>
						<Input placeholder="Last Name" />
					</Form.Item>

					<Form.Item
						name="email"
						rules={[
							{
								required: true,
								message: "Please enter your email address!",
							},
							{
								type: "email",
								message: "Please enter a valid email address!",
							},
						]}
					>
						<Input placeholder="Email" />
					</Form.Item>

					<Form.Item
						name="password"
						rules={[
							{ required: true, message: "Please enter your password!" },
							{
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
							Create
						</Button>
					</Form.Item>
				</Form>
				{error && <Alert type="error" message={error.msg} />}
			</Card>
		</div>
	);
};

export default CreateUser;
