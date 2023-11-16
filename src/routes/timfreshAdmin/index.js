import { useCallback, useEffect, useState } from 'react';
import InformationForm from 'components/informationForm';
import Table from 'components/table';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { deliveryOrderListAtom } from 'atom/Atom';
import { cx } from 'styles';
import styles from './timfreshAdmin.module.scss';
import { useQuery } from 'react-query';

async function fetchDeliveryOrderList() {
  return await axios.get(`/order`);
}

const TimfreshAdmin = () => {
  const setDeliveryOrderList = useSetRecoilState(deliveryOrderListAtom);
  const [copyAction, setCopyAction] = useState(false);
  const { data, isLoading } = useQuery('getOrder', fetchDeliveryOrderList);

  useEffect(() => {
    //getDeliveryOrderList()
    if (!isLoading) setDeliveryOrderList(data.data);
  }, []);

  // const getDeliveryOrderList = useCallback(async ()=>{
  //     try {
  //         const res = await axios.get(`/order`)
  //         setDeliveryOrderList(res.data)
  //     }catch (e){
  //         console.error(e)
  //     }
  // },[])

  const handleClickOrderCopy = useCallback(() => {
    setCopyAction(true);
  }, []);

  return (
    <div className={cx.wrap}>
      <InformationForm orderCopyAction={copyAction} />
      <Table onClickOderCopy={handleClickOrderCopy} />
    </div>
  );
};

export default TimfreshAdmin;
