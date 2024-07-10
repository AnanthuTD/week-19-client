"use client";
import { Button } from "antd";
import GoogleIcon from "./GoogleIcon";

function GoogleButton() {
	return (
		<Button
			className="w-full "
			style={{ padding: "1.25rem", fontWeight: "500" }}
			icon={<GoogleIcon />}
			href={`${import.meta.env.VITE_API}/auth/google`}
		>
			Sign in with Google
		</Button>
	);
}

export default GoogleButton;
