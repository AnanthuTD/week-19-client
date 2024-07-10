import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "../types";
import { Spin } from "antd";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice";
import { axiosPrivate } from "../lib/axiosPrivate";

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	setUser: () => {},
});

function AuthProvider() {
	// const user = useSelector((state: RootState) => state.user.data);
	const dispatch = useDispatch<AppDispatch>();
	const [isAuthenticating, setAuthenticating] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const authenticateUser = async (): Promise<void> => {
			try {
				const { data } = await axiosPrivate.get("/api/user", {
					withCredentials: true,
				});

				if (data?.user) {
					dispatch(login(data.user));
				} else {
					throw new Error("No user found");
				}
			} catch (error) {
				navigate("/login", { replace: true });
			} finally {
				setAuthenticating(false);
			}
		};

		authenticateUser();
	}, [dispatch, navigate]);

	return (
		<Spin spinning={isAuthenticating} size="large" tip="authenticating">
			<div style={{ height: "100vh" }}>
				{!isAuthenticating && <Outlet />}
			</div>
		</Spin>
	);
}

export const UseUser = (): AuthContextType =>
	useContext<AuthContextType>(AuthContext);

export default AuthProvider;
