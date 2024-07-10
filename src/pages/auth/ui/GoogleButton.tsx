"use client";
import { Button, message } from "antd";
import GoogleIcon from "./GoogleIcon";
import {
	CodeResponse,
	GoogleCredentialResponse,
	useGoogleLogin,
	useGoogleOneTapLogin,
} from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import axios from "axios";
import { setAuthorizationToken } from "../../../lib/axiosPrivate";
import { login } from "../../../features/user/userSlice";
import { User } from "../../../types";

function GoogleButton({ setError }: { setError: (errorData: string) => void }) {
	const dispatch = useDispatch<AppDispatch>();
	async function onSuccess(
		response: Omit<CodeResponse, "error" | "error_description" | "error_uri">
	) {
		try {
			const { data } = await axios.post("/api/auth/google", response);
			const { user, accessToken }: { user: User; accessToken: string } =
				data;
			if (user && accessToken) {
				dispatch(login(user));
				setAuthorizationToken(accessToken);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data);
				console.error(error.response.data.msg);
			} else {
				setError("Unexpected error occurred!");
				console.error(error);
			}
		}
	}

	async function onSuccessOneTap(response: GoogleCredentialResponse) {
		console.log(response);

		try {
			const { data } = await axios.post(
				"/api/auth/google/one-tap",
				response
			);
			const { user, accessToken }: { user: User; accessToken: string } =
				data;
			if (user && accessToken) {
				dispatch(login(user));
				setAuthorizationToken(accessToken);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data);
				console.error(error.response.data.msg);
			} else {
				setError("Unexpected error occurred!");
				console.error(error);
			}
		}
	}

	function onError() {
		message.error("Failed to sign in with google");
	}

	const handleLogin = useGoogleLogin({
		onSuccess,
		onError,
		flow: "auth-code",
		// ux_mode: "redirect",
		// redirect_uri: "http://localhost:5173/login",
		
	});
	useGoogleOneTapLogin({
		onSuccess: onSuccessOneTap,
		onError,
		use_fedcm_for_prompt: true,
	});
	return (
		<Button
			className="w-full "
			style={{ padding: "1.25rem", fontWeight: "500" }}
			icon={<GoogleIcon />}
			onClick={() => handleLogin()}
		>
			Sign in with Google
		</Button>
	);
}

export default GoogleButton;
