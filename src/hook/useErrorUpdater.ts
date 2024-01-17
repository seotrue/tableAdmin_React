import { useEffect } from 'react';
import { isEqual } from 'lodash';

export const useErrorUpdater = (errorMsg, setErrorMsg, key, value) => {
	useEffect(() => {
		if (!isEqual(value, errorMsg[key])) {
			setErrorMsg((prevState) => ({ ...prevState, [key]: value }));
		}
	}, [value, key, errorMsg]);
};
