import mem from "mem";
import axios from "axios";
import { setAuthorizationToken } from "./axiosPrivate";

const refreshTokenFn = async () => {
	try {
		console.log('refreshing...');
		
		const response = await axios.post("/api/auth/refresh");

		const { accessToken } = response.data;

		if (!accessToken) {
			console.log('Invalid refresh token......');
			
			setAuthorizationToken(null);
		}

		setAuthorizationToken(accessToken);

		return accessToken;
	} catch (error) {
		console.error("refreshToken", error);
		setAuthorizationToken(null);
	}
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
	maxAge,
});
