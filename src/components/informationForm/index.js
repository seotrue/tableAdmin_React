import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { deliveryOrderListAtom, loadPlaceAtom, selectedOrderCopyAtom } from 'atom/Atom';
import { find, findIndex, isEmpty, isNull, isUndefined } from 'lodash';
import Select from 'react-select';
import axios from 'axios';
import dayjs from 'dayjs';
import DaumPostcode from 'react-daum-postcode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'components/modal';
import ModalLayout from 'components/modal/ModalLayout';
import useInput from 'hook/useInput';
import { CONSTANT } from 'constant/constant';
import LoadForm from './loadForm';
import Button from '../common/Button';

import styles from './informationForm.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ITEM_OPTIONS = [
  { value: '냉장품', label: '냉장품' },
  { value: '냉동품', label: '냉동품' },
  { value: '직접입력', label: '직접입력' },
];

const SUPPLY_OPTIONS = [
  { value: 'default', label: '선택' },
  { value: 'PLT', label: 'PLT' },
  { value: 'BOX', label: 'BOX' },
  { value: 'EA', label: 'EA' },
];

const InformationForm = ({ orderCopyAction }) => {
  const loadPlace = useRecoilValue(loadPlaceAtom);
  const setLoadPlace = useSetRecoilState(loadPlaceAtom);
  const selectedOrderCopy = useRecoilValue(selectedOrderCopyAtom);
  const deliveryOrderList = useRecoilValue(deliveryOrderListAtom);

  const [name, , setName] = useInput('');
  const [phone, , setPhone] = useInput('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [itemOptions, setItemOptions] = useState(undefined);
  const [itemDetail, onChangeInput, setItemDetail] = useInput('');
  const [supplyOptions, setSupplyOptions] = useState();
  const [supplyDetail, onChangeSupplyDetail, setSupplyDetail] = useInput('');
  const [modalData, setModalData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModal, setIsRegisterModal] = useState(null);
  const [errorMsg, setErrorMsg] = useState({
    name: null,
    phone: null,
    date: null,
    detailOptions: null,
    supplyOptions: null,
    address: null,
  });

  useEffect(() => {
    if (orderCopyAction) {
      insertInformation();
    }
  }, [orderCopyAction, selectedOrderCopy]);

  const validation = useCallback(() => {
    let errorBody = { ...errorMsg };
    let result = true;

    // 이름
    if (isEmpty(name)) {
      errorBody = {
        ...errorBody,
        name: '값을 입력 해주세요',
      };
      result = false;
    }
    // 휴대폰
    if (isEmpty(phone)) {
      errorBody = {
        ...errorBody,
        phone: '값을 입력 해주세요',
      };
      result = false;
    }
    // 품목
    console.log(itemOptions, 'itemOptions', itemDetail);
    if (isUndefined(itemOptions) || (itemOptions.value === '직접입력' && isEmpty(itemDetail))) {
      errorBody = {
        ...errorBody,
        detailOptions: '값을 입력 해주세요',
      };
      result = false;
    } else {
      errorBody = {
        ...errorBody,
        detailOptions: null,
      };
    }

    //물량
    if (!isUndefined(supplyOptions) && supplyOptions.value === 'default' && isEmpty(supplyDetail)) {
      errorBody = {
        ...errorBody,
        supplyOptions: '값을 입력 해주세요',
      };
      result = false;
    } else {
      errorBody = {
        ...errorBody,
        supplyOptions: null,
      };
    }

    // 출근지
    if (isEmpty(modalData)) {
      errorBody = {
        ...errorBody,
        address: '값을 입력 해주세요',
      };
      result = false;
    } else {
      errorBody = {
        ...errorBody,
        address: null,
      };
    }

    console.log(loadPlace, 'loadPlace ::::::::::::::');
    let loadAddress, loadDate, loadName;
    // 상차지 정보 유효성 체크
    // eslint-disable-next-line no-undef,no-const-assign
    ({ address = loadAddress, date = loadDate, name = loadName } = loadPlace);
    if (isEmpty(loadAddress) || isEmpty(loadDate) || isEmpty(loadName)) result = false;

    return {
      errorBody,
      isVaild: result,
    };
  }, [name, phone, startDate, endDate, itemOptions, itemDetail, supplyOptions, supplyDetail, modalData]);

  const onChangeName = useCallback((event) => {
    const regName = /^[가-힣a-zA-Z\s]+$/;
    let errorMsg = null;

    if (!regName.test(event.target.value)) errorMsg = '한글, 영어, 공백만 입력 가능 합니다';
    else errorMsg = null;

    setErrorMsg((prevState) => ({
      ...prevState,
      name: errorMsg,
    }));
    setName(event.target.value);
  }, []);

  const onChangPhone = useCallback((event) => {
    let errorMsg = null;
    const val = event.target.value
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      .replace(/(-{1,2})$/g, '');
    const regPhone = /^\d{3}-\d{4}-\d{4}$/;

    if (!regPhone.test(event.target.value)) errorMsg = '알맞는 핸드폰 번호 형식을 입력 해주세요';
    else errorMsg = null;

    setErrorMsg((prevState) => ({
      ...prevState,
      phone: errorMsg,
    }));
    setPhone(val);
  }, []);

  const insertInformation = useCallback(() => {
    const targetItem = find(deliveryOrderList, { seqNo: selectedOrderCopy.seqNo });
    const findItemOptionIdx = findIndex(ITEM_OPTIONS, { value: targetItem.item });

    setName(targetItem.name);
    setPhone(targetItem.phoneNumber);
    setItemOptions(ITEM_OPTIONS[findItemOptionIdx]);
    setItemDetail(targetItem.itemDetail);
    setStartDate(new Date(targetItem.fromDate));
    setEndDate(new Date(targetItem.toDate));
    setSupplyOptions(isEmpty(targetItem.supplyOptions) ? undefined : [targetItem.supplyOptions]);
    setSupplyDetail(targetItem.supplyDetail);
    setModalData(targetItem.address);
    setErrorMsg({
      name: null,
      phone: null,
      date: null,
      detailOptions: null,
      supplyOptions: null,
      address: null,
    });
  }, [selectedOrderCopy, deliveryOrderList, loadPlace]);

  const handleComplete = useCallback((data) => {
    const address = `${data.roadAddress}(${data.bname},${data.buildingName})`;
    setModalData(address);
    setIsModalOpen(false);
  }, []);

  const isValidDate = (newDate, type) => {
    let dateErrorMsg = null;
    const newDataSec = dayjs(newDate).valueOf();
    const startSec = dayjs(startDate).valueOf();
    const endSec = dayjs(endDate).valueOf();

    if (type === 'startDate') {
      dateErrorMsg = newDataSec >= endSec ? '시작날짜 보다 종료날짜가 더 크도록 입력 해주세요' : null;
      setStartDate(newDate);
    } else {
      dateErrorMsg = newDataSec <= startSec ? '시작날짜 보다 종료날짜가 더 크도록 입력 해주세요' : null;
      setEndDate(newDate);
    }

    setErrorMsg((prevState) => ({
      ...prevState,
      date: dateErrorMsg,
    }));
  };

  const handleRegister = async () => {
    if (!validation().isVaild) {
      console.log(validation().errorBody, 'emfdjdha');
      setErrorMsg(validation().errorBody);
      return;
    }

    try {
      const body = {
        name: name,
        phoneNumber: phone,
        fromDate: startDate,
        toDate: endDate,
        item: itemOptions,
        itemDetail: isUndefined(itemDetail) ? '' : itemDetail,
        supply: isUndefined(supplyOptions) || supplyOptions.value === 'default' ? '' : supplyOptions,
        supplyDetail: supplyDetail,
        address: modalData,
        loadPlace: loadPlace,
      };
      const res = await axios.post('/order', body);
      console.log(res, 'res');
      if (res.status === 200) {
        await setIsRegisterModal({
          data: res.data.data,
          title: res.data.message,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickAddLoadPlace = useCallback(() => {
    setLoadPlace([...loadPlace, { name: '', address: '', date: '' }]);
  }, [loadPlace]);

  return (
    <>
      <div className={cx('wrap')}>
        <ul className={cx('form')}>
          <li className={cx('line')}>
            <span className={cx('label')}>이름</span>
            <span>
              <input type="text" value={name} onChange={(event) => onChangeName(event)} />
            </span>
            {!isNull(errorMsg.name) && <p className={cx('errorMsg')}>{errorMsg.name}</p>}
          </li>
          <li className={cx('line')}>
            <span className={cx('label')}>휴대폰 번호</span>
            <span>
              <input type="text" maxLength={13} value={phone} onChange={(event) => onChangPhone(event)} />
            </span>
            {!isNull(errorMsg.phone) && <p className={cx('errorMsg')}>{errorMsg.phone}</p>}
          </li>
          <li className={cx('line')}>
            <span className={cx('label')}>날짜</span>
            <span>
              <DatePicker
                selected={startDate}
                onChange={(date) => isValidDate(date, 'startDate')}
                dateFormat={CONSTANT.FORMAT.DATE_ONLY_HYPHEN}
              />
              ~
              <DatePicker
                selected={endDate}
                onChange={(date) => isValidDate(date, 'endDate')}
                dateFormat={CONSTANT.FORMAT.DATE_ONLY_HYPHEN}
              />
            </span>

            {!isNull(errorMsg.date) && <p className={cx('errorMsg')}>{errorMsg.date}</p>}
          </li>
          <li className={cx('line')}>
            <span className={cx('label')}>품목</span>
            <span>
              <Select
                placeholder={'선택'}
                defaultValue={itemOptions}
                key={itemOptions}
                onChange={setItemOptions}
                options={ITEM_OPTIONS}
              />
              <input
                type={'text'}
                value={itemDetail}
                onChange={onChangeInput}
                disabled={isUndefined(itemOptions) || itemOptions.value !== '직접입력'}
              />
            </span>
            {!isNull(errorMsg.detailOptions) && <p className={cx('errorMsg')}>{errorMsg.detailOptions}</p>}
          </li>
          <li className={cx('line')}>
            <span className={cx('label')}>물량</span>
            <span>
              <Select
                placeholder={'선택'}
                defaultValue={supplyOptions}
                key={supplyOptions}
                onChange={setSupplyOptions}
                options={SUPPLY_OPTIONS}
              />
              <input
                type={'text'}
                value={supplyDetail}
                onChange={onChangeSupplyDetail}
                disabled={!!isUndefined(supplyOptions) || supplyOptions.value === 'default'}
              />
            </span>
            {!isNull(errorMsg.supplyOptions) && <p className={cx('errorMsg')}>{errorMsg.supplyOptions}</p>}
          </li>
          <li className={cx('line')}>
            <span className={cx('label')}>출근지</span>
            <span>
              <input
                type="text"
                readOnly={true}
                value={modalData}
                onClick={(event) => setIsModalOpen((prev) => !prev)}
              />
            </span>
            {!isNull(errorMsg.address) && <p className={cx('errorMsg')}>{errorMsg.address}</p>}
          </li>
        </ul>

        {/* 상하차 정보 폼 */}
        {loadPlace.map((box, idx) => {
          // eslint-disable-next-line no-restricted-globals,no-undef
          return <LoadForm cx={cx} key={self.crypto.randomUUID()} idx={idx} />;
        })}

        {loadPlace.length < 3 && (
          <div className={cx('boxForm')} onClick={handleClickAddLoadPlace}>
            {' '}
            <span className={cx('add')}>+</span>{' '}
          </div>
        )}

        {isModalOpen && (
          <>
            <ModalLayout open={isModalOpen} close={() => setIsModalOpen(false)}>
              <DaumPostcode onComplete={handleComplete} />
            </ModalLayout>
          </>
        )}

        {!isNull(isRegisterModal) && (
          <>
            <Modal open={isRegisterModal} close={() => setIsRegisterModal(null)} data={isRegisterModal} />
          </>
        )}
      </div>

      <Button onEvent={handleRegister} text={'등록'} />
    </>
  );
};

export default InformationForm;
