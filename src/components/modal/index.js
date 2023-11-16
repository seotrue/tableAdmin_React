import ReactDom from 'react-dom'
import styles from "components/modal/modal.module.scss"
import { json } from 'react-router-dom';

const Backdrop = () => {
    return <div className={styles.overlay} />
}

const Index = ({ close, data }) => {
    const closeModal = () => {
        close()
    }
    console.log(data,'dddddd')
    return (
        <>
            {ReactDom.createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
            {ReactDom.createPortal(
                <div className={styles.modal}>
                    <button onClick={closeModal}>취소</button>
                    {data && (
                      <>
                          <h3>{data.title}</h3>
                          <div>{ JSON.stringify(data.data)}</div>
                      </>

                    )}
                </div>,
                document.getElementById('modal-root'),
            )}
        </>
    )
}

export default Index
