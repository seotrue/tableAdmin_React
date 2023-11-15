import ReactDom from 'react-dom'
import styles from "./modal.moual.scss"

const Backdrop = () => {
    return <div className={styles.overlay} />
}

const Modal = ({ close, children }) => {
    const closeModal = () => {
        close()
    }

    return (
        <>
            {ReactDom.createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {ReactDom.createPortal(
                <div className={styles.modal}>
                    <button onClick={closeModal}>취소</button>
                    {children}
                </div>,
                document.getElementById('modal-root'),
            )}
        </>
    )
}

export default Modal
