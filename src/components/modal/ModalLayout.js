import ReactDom from 'react-dom'
import styles from "components/modal/modal.module.scss"

const Backdrop = () => {
    return <div className={styles.overlay} />
}

const Index = ({ close, children, data }) => {
    const closeModal = () => {
        close()
    }
        console.log(children,'children')
    return (
        <>
            {ReactDom.createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {ReactDom.createPortal(
                <div className={styles.modal}>
                    <button onClick={closeModal}>취소</button>
                    {children && children}
                    {data && (
                      <>
                          <h3>{data.title}</h3>
                          <div>{data.data}</div>
                      </>

                    )}
                </div>,
                document.getElementById('modal-root'),
            )}
        </>
    )
}

export default Index
