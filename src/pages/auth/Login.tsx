import {
	Card,
	Form,
	Input,
	Button,
	Alert,
	Typography,
	Divider,
	theme,
} from "antd";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { User } from "../../types";
import "./styles.css";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/user/userSlice";
import { setAuthorizationToken } from "../../lib/axiosPrivate";
import GoogleButton from "./ui/GoogleButton";

interface LoginError {
	msg?: string;
	code?: string;
	error?: boolean;
}

const Login = () => {
	const {
		token: { colorBgContainer, colorPrimaryText },
	} = theme.useToken();

	const user = useSelector((state: RootState) => state.user.data);
	const dispatch = useDispatch<AppDispatch>();

	const [error, setError] = useState<LoginError | null>(null);

	const onFinish = async (values: { email: string; password: string }) => {
		setError(null);
		try {
			const res = await axios.post("/api/auth/login", values, {
				withCredentials: true,
			});
			const { user, accessToken }: { user: User; accessToken: string } =
				res.data;
			if (user) {
				dispatch(login(user));
				setAuthorizationToken(accessToken);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data);
				console.error(error.response.data.msg);
			} else {
				setError({ msg: "unexpected error" });
				console.error(error);
			}
		}
	};

	return user ? (
		<Navigate
			to={user.role === "admin" ? "/admin/user" : "/user/dashboard"}
			replace={true}
		/>
	) : (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				background: colorBgContainer,
				color: colorPrimaryText,
			}}
		>
			<Card style={{ width: 500 }} title="Login">
				<div className="google-login-container">
					<GoogleButton
						setError={(errorMessage) => setError({ msg: errorMessage})}
					/>
				</div>
				<Divider />
				<Form onFinish={onFinish}>
					<Form.Item
						name={"email"}
						required={true}
						rules={[
							{
								type: "email",
								required: true,
								message: "Please input your email address!",
							},
						]}
					>
						<Input placeholder="Email" />
					</Form.Item>
					<Form.Item
						name={"password"}
						rules={[
							{
								required: true,
								message: "Please input your password!",
							},
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
							style={{ width: "100%" }}
							htmlType="submit"
							type="primary"
						>
							Login
						</Button>
					</Form.Item>
				</Form>
				{error && (
					<Alert
						type={"error"}
						message={<Typography.Text>{error.msg}</Typography.Text>}
					/>
				)}

				<Typography.Text>
					Not a user? <Link to={"/sign-up"}>sign-up now</Link>
				</Typography.Text>
			</Card>
		</div>
	);
};

export default Login;
