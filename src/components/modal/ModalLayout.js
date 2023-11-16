import ReactDom from 'react-dom'
import styles from "components/modal/modal.module.scss"

const Backdrop = () => {
    return <div className={styles.overlay} />
}

const ModalLayout = ({ close, children }) => {
    const closeModal = () => {
        close()
    }
    return (
        <>
            {ReactDom.createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {ReactDom.createPortal(
                <div className={styles.modal}>
                    <button onClick={closeModal}>취소</button>
                    {children && children}

                </div>,
                document.getElementById('modal-root'),
            )}
        </>
    )
}

export default ModalLayout
