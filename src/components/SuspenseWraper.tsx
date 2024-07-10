import { Spin } from "antd";
import { Suspense, ReactNode } from "react";

const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<Suspense
			fallback={
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "100vh",
					}}
				>
					<Spin size="large" tip="loading"/>
				</div>
			}
		>
			{children}
		</Suspense>
	);
};

export default SuspenseWrapper;
