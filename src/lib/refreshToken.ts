import mem from "mem";
import axios from "axios";
import { setAuthorizationToken } from "./axiosPrivate";

const refreshTokenFn = async () => {
	try {
		console.log('refreshing...');
		
		const response = await axios.post("/api/auth/refresh");

		console.log('response: ' , response);
		

		const { accessToken } = response.data;

		console.log('access token: ' + accessToken);
		

		if (!accessToken) {
			console.log('Invalid refresh token......');
			
			setAuthorizationToken(null);
			localStorage.removeItem("user");
		}

		setAuthorizationToken(accessToken);

		return accessToken;
	} catch (error) {
		console.error("refreshToken", error);
		localStorage.removeItem("user");
		setAuthorizationToken(null);
	}
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
	maxAge,
});
