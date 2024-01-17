import { apiRequest } from '../utils/ApiService.ts';
import { isUndefined } from 'lodash';

export const useFetch = () => {
	// const [response, setResponse] = useState<null | ResponseDataType>(null);
	// const [error, setError] = useState<null | ResponseErrorType>(null);

	const callFetchData = async ({ url, method, params }) => {
		try {
			const res: any = await apiRequest({
				url,
				method,
				data: params
			});
			if (isUndefined(res?.code)) {
				res.code = 200;
			}
			return res;
		} catch (error) {
			return error;
			//setError(error as unknown as ResponseErrorType);
		}
	};
	return { callFetchData };
};
