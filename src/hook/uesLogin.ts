import { shallowEqual, useSelector } from 'react-redux';
import { loginThunk } from 'store/api/UserApi.tsx';
import { ResponseErrorType } from 'types/api';
import { useAppDispatch } from './commonRedux.tsx';
import { useNavigate } from 'react-router-dom';
import { LoginRequest } from 'types/login.ts';
import { useState } from 'react';
import { errorMsg } from 'components/common/Input';
import { setCookies } from '../utils/cookies.ts';
import dayjs from 'dayjs';
import { RootState } from '../store';

export const useLogin = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { isLogin } = useSelector((state: RootState) => state.user, shallowEqual);

	const [errorMsg, setErrorMsg] = useState<errorMsg>({
		id: null,
		pw: null
	});

	const login = async (id, pw) => {
		const body: LoginRequest = { user_id: id, password: pw };
		try {
			const { token } = await dispatch(loginThunk(body)).unwrap();
			setCookies('accessToken', token, dayjs().add(1, 'day').toString());
			navigate('/main');
		} catch (e) {
			const { code, message } = e as ResponseErrorType;
			if (code === '400') {
				setErrorMsg({
					id: '',
					pw: message
				});
			}
		}
	};

	return {
		login,
		isLogin,
		errorMsg
	};
};
