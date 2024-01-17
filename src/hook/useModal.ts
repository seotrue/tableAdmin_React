import { useState } from 'react';

const initialState = { id: '', open: false };
const useModal = () => {
	const [contentsModal, setContentsModal] = useState(initialState);

	const openModal = (id: string) => {
		setContentsModal({ id, open: true });
	};

	const closeModal = () => {
		setContentsModal(initialState);
	};
	return {
		contentsModal,
		openModal,
		closeModal
	};
};

export default useModal;
