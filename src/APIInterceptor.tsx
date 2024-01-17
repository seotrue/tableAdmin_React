import axios from 'axios';
import { getCookies } from './cookies.ts';

// url 호출 시 기본 값 셋팅
const api = axios.create({
	baseURL: `${process.env.REACT_APP_API_URL}`,
	headers: { 'Content-type': 'application/json' } // data type
});

// Add a request interceptor
api.interceptors.request.use(
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	function (config) {
		const accessToken = getCookies('accessToken');

		//요청시 AccessToken 계속 보내주기
		if (!accessToken) {
			config.headers.accessToken = null;
			config.headers.refreshToken = null;
			return config;
		}

		if (config.headers && accessToken) {
			config.headers.authorization = `Bearer ${accessToken}`;
			//config.headers.refreshToken = `Bearer ${refreshToken}`;
			return config;
		}
		// Do something before request is sent
		console.log('request start', config);
	},
	function (error) {
		// Do something with request error
		console.log('request error', error);
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	function (response) {
		console.log('get response', response);
		return response;
	},
	async (error) => {
		const {
			config,
			response: { status }
		} = error;
		if (status === 401) {
			if (error.response.data.message === 'expired') {
				const originalRequest = config;
				const refreshToken = await localStorage.getItem('refreshToken');
				// token refresh 요청
				const { data } = await axios.post(
					`http://localhost:3000/refreshToken`, // token refresh api
					{},
					{ headers: { authorization: `Bearer ${refreshToken}` } }
				);
				// 새로운 토큰 저장
				// dispatch(userSlice.actions.setAccessToken(data.data.accessToken)); store에 저장
				const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
				await localStorage.multiSet([
					['accessToken', newAccessToken],
					['refreshToken', newRefreshToken]
				]);
				originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
				// 401로 요청 실패했던 요청 새로운 accessToken으로 재요청
				return axios(originalRequest);
			}
		}
		return Promise.reject(error);
	}
);

export default api;
