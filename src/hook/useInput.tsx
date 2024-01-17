import { useState } from 'react';
import { isUndefined } from 'lodash';
import { UTIlS } from '../utils/helper.ts';

export const useInput = (initValue, validationType?: string) => {
	const [value, setter] = useState(initValue);
	const [errorMsg, setErrorMsg] = useState(null);

	const handleChangeValidationCheck = (value, type) => {
		return UTIlS.validationCheckByType(type, value);
	};

	const handler = (e) => {
		const { value } = e.target;
		if (!isUndefined(validationType)) {
			const msg = handleChangeValidationCheck(value, validationType);
			setErrorMsg(msg);
		}
		setter(value);
	};
	return [value, handler, setter, errorMsg];
};
