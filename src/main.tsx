import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import SuspenseWrapper from "./components/SuspenseWraper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./app/store";
// import UserLayout from "./pages/Layout";
import { ConfigProvider, theme } from "antd";

const UserManagement = React.lazy(() => import("./pages/admin/Dashboard"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Dashboard = React.lazy(() => import("./pages/Profile"));
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
		element: (
			<SuspenseWrapper>
				<AuthProvider />
			</SuspenseWrapper>
		),
		children: [
			{
				path: "sign-up",
				element: (
					<SuspenseWrapper>
						<SignUp />
					</SuspenseWrapper>
				),
			},
			{
				path: "login",
				element: (
					<SuspenseWrapper>
						<Login />
					</SuspenseWrapper>
				),
			},
			{
				path: "user",
				element: (
					<SuspenseWrapper>
						<Layout />
					</SuspenseWrapper>
				),
				children: [
					{
						path: "dashboard",
						element: (
							<SuspenseWrapper>
								<Dashboard />
							</SuspenseWrapper>
						),
					},
				],
			},
			{
				path: "admin",
				element: (
					<SuspenseWrapper>
						<Layout />
					</SuspenseWrapper>
				),
				children: [
					{
						path: "",
						element: (
							<SuspenseWrapper>
								<Profile />
							</SuspenseWrapper>
						),
					},
					{
						path: "user",
						element: (
							<SuspenseWrapper>
								<UserManagement />
							</SuspenseWrapper>
						),
					},
					{
						path: "create-user",
						element: (
							<SuspenseWrapper>
								<CreateUser />
							</SuspenseWrapper>
						),
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
		<Provider store={store}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
				<React.StrictMode>
					<RouterProvider
						router={router}
						future={{ v7_startTransition: true }}
					/>
				</React.StrictMode>
			</GoogleOAuthProvider>
		</Provider>
	</ConfigProvider>
);
