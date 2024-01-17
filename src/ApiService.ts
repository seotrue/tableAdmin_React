import api from './APIInterceptor.tsx';
import axios, { AxiosError } from 'axios';
import { ResponseErrorType } from '../types/api';

const getErrorMessage = (err: AxiosError<ResponseErrorType, any>) => {
	switch (err.response?.data.code) {
		case 401:
		case 402:
			return {
				message: `접근 권한이 없습니다.
				로그인을 해주세요.
				`
			};
		case 409:
		case 500:
			return {
				message: `서비스에 접속할 수 없습니다.
									새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.
				`
			};
		default:
			return {
				message:
					err.response?.data.message ||
					`서비스에 접속할 수 없습니다.
					새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.`
			};
	}
};

export function getApiServerURL() {
	return process.env.REACT_APP_API_URL;
}

export const apiRequest = async function (options) {
	const apiServerURL = getApiServerURL();
	try {
		const url = `${apiServerURL}${options.url}`;
		const response = await api({ url, ...options });
		if (response.status === 200) {
			return { data: response?.data, code: 200 };
		}
	} catch (error) {
		if (axios.isAxiosError<ResponseErrorType, any>(error)) {
			const { message } = getErrorMessage(error);
			return { code: error?.response?.data.code, message };
		}
	}
};
