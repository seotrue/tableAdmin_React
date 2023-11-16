import { cloneDeep, isEmpty, isNull } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import useInput from '../../hook/useInput';
import { CONSTANT } from '../../constant/constant';
import DatePicker from 'react-datepicker';
import Modal from '../modal';
import DaumPostcode from 'react-daum-postcode';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loadPlaceAtom } from '../../atom/Atom';

const LoadForm = ({ cx, idx }) => {
  const loadPlace = useRecoilValue(loadPlaceAtom);
  const setLoadPlace = useSetRecoilState(loadPlaceAtom);

  const [name, , setName] = useInput('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    name: null,
    date: null,
    address: null,
  });

  useEffect(() => {
    if (isEmpty(loadPlace.address) || isEmpty(loadPlace.date) || isEmpty(loadPlace.name)) {
      const errMsh = '값을 입력 해주세요';
      setErrorMsg({
        name: errMsh,
        date: errMsh,
        address: errMsh,
      });
    }
  }, [loadPlace]);

  console.log();
  const handleComplete = useCallback(
    (data) => {
      const address = `${data.roadAddress}(${data.bname},${data.buildingName})`;
      const update = cloneDeep(loadPlace);
      update[idx].address = address;
      setIsModalOpen(false);
      setLoadPlace(update);
    },
    [idx, loadPlace],
  );

  const handleClose = useCallback(() => {
    setLoadPlace(loadPlace.filter((v, i) => i !== idx));
  }, [idx, loadPlace]);

  const handleChangeDate = useCallback(
    (date) => {
      const update = cloneDeep(loadPlace);
      update[idx].date = date;
      setLoadPlace(update);
    },
    [idx, loadPlace],
  );

  const handleBlurName = useCallback(() => {
    const update = cloneDeep(loadPlace);
    update[idx].name = name;
    setLoadPlace(update);
  }, [idx, loadPlace, name]);

  const onChangeName = useCallback((event) => {
    setName(event.target.value);
  }, []);

  useEffect(() => {
    setName(loadPlace[idx].name);
  }, [idx, loadPlace]);

  return (
    <div className={cx('boxForm')}>
      <h3>상차지정보</h3>
      {idx !== 0 && (
        <p className={cx('closeBtn')} onClick={handleClose}>
          X
        </p>
      )}
      <ul>
        <li>
          <span>담당자</span>
          <span>
            <input type="text" value={name} onChange={(event) => onChangeName(event)} onBlur={handleBlurName} />
          </span>
          {!isNull(errorMsg.name) && <span className={cx('errorMsg')}>{errorMsg.name}</span>}
        </li>
        <li>
          <span>날짜</span>
          <span>
            <DatePicker
              selected={loadPlace[idx].date}
              onChange={(date) => handleChangeDate(date)}
              dateFormat={CONSTANT.FORMAT.DATE_ONLY_HYPHEN}
            />
          </span>
          {!isNull(errorMsg.date) && <span className={cx('errorMsg')}>{errorMsg.date}</span>}
        </li>
        <li>
          <span>상차지</span>
          <input
            type="text"
            readOnly={true}
            value={loadPlace[idx].address}
            onClick={(event) => setIsModalOpen((prev) => !prev)}
          />
          {!isNull(errorMsg.address) && <span className={cx('errorMsg')}>{errorMsg.address}</span>}
        </li>
      </ul>
      {isModalOpen && (
        <>
          <Modal open={isModalOpen} close={() => setIsModalOpen(false)}>
            <DaumPostcode onComplete={handleComplete} />
          </Modal>
        </>
      )}
    </div>
  );
};

export default LoadForm;
