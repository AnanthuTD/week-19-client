import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SuspenseWrapper from "./components/SuspenseWraper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ConfigProvider, theme } from "antd";
import "./index.css";

const Layout = React.lazy(() => import("./pages/Layout"));
const AuthProvider = React.lazy(() => import("./context/AuthContext"));
const UserManagement = React.lazy(() => import("./pages/admin/Dashboard"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));
const SignUp = React.lazy(() => import("./pages/auth/SignUp"));
const CreateUser = React.lazy(() => import("./pages/admin/CreateUser"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Privacy = React.lazy(() => import("./pages/policy/Privacy"));

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/privacy",
		element: <Privacy />,
	},
	{
		element: <AuthProvider />,
		children: [
			{
				path: "sign-up",
				element: <SignUp />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "user",
				element: <Layout />,
				children: [
					{
						path: "dashboard",
						element: <Profile />,
					},
				],
			},
			{
				path: "admin",
				element: <Layout />,
				children: [
					{
						path: "",
						element: <Profile />,
					},
					{
						path: "user",
						element: <UserManagement />,
					},
					{
						path: "create-user",
						element: <CreateUser />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
		<Provider store={store}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
				<React.StrictMode>
					<SuspenseWrapper>
						<RouterProvider
							router={router}
							future={{ v7_startTransition: true }}
						/>
					</SuspenseWrapper>
				</React.StrictMode>
			</GoogleOAuthProvider>
		</Provider>
	</ConfigProvider>
);
