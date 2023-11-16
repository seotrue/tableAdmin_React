import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isEmpty, isEqual, isNull } from 'lodash'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  deliveryOrderListAtom,
  deliveryOrderListPageQueryAtom,
  selectedOrderCopyAtom,
  selectedOrderIdsAtom,
} from 'atom/Atom';
import dayjs from 'dayjs'
import { CONSTANT } from 'constant/constant'

const TableBody = ({ onClickOderCopy, isAllChecked }) => {
  const listAtom = useRecoilValue(deliveryOrderListAtom)
  const listPageQueryAtom = useRecoilValue(deliveryOrderListPageQueryAtom)
  const setSelectedOrderCopyData = useSetRecoilState(selectedOrderCopyAtom)
  const selectedOrderIds = useSetRecoilState(selectedOrderIdsAtom)
  const [selectedOrderId, setSelectedOrderIds] = useState([])

  const [list, setList] = useState([])

  useEffect(() => {
    const { size, page, totalPage } = listPageQueryAtom
    const realPageIdx = page - 1
    const startIdx = realPageIdx === 0 ? 0 : realPageIdx * size
    let updateState;

    if (page === totalPage) {
      updateState = listAtom?.slice(startIdx);
    } else {
      const endIdx = realPageIdx === 0 ? size : size * (realPageIdx + 1)
      updateState = listAtom?.slice(startIdx, endIdx)
    }
    setList(updateState)
  }, [listPageQueryAtom, listAtom])

  useEffect(()=>{
    console.log(isAllChecked)
    const ids = isAllChecked ? list.map(id => id.seqNo) : []
    console.log(isAllChecked,'isAllChecked')
    setSelectedOrderIds(ids)
  },[isAllChecked, list])

  const handleClickOrderCopy = useCallback(async (item) => {
    const { seqNo, loadPlace } = item

    await setSelectedOrderCopyData({
      seqNo,
      loadPlace
    })
    await onClickOderCopy()

  }, [list])

  const checkSelected = useCallback((id) => {
      return selectedOrderId.indexOf(id) !== -1;
    },
    [selectedOrderId]
  );

  const handleChangeCheckBox = async (event, id) => {
    console.log('이벤트 발생')
    event.stopPropagation();
    // selectedOrderId.indexOf(id) !== -1: 일때 true이므로 빼줘여함
    let updateState;
    if (selectedOrderId.indexOf(id) !== -1) {
      updateState = selectedOrderId.filter(value => value !== id)
    }else updateState = [...selectedOrderId, id]

    console.log(updateState,'update')

    await selectedOrderIds(updateState)
    setSelectedOrderIds(updateState)
  }

  return (
    <tbody>
    {list.map((item) => (
      <tr key={item.seqNo}>
        <td>
          <input
            type={'checkbox'}
            id={item.seqNo}
            checked={checkSelected(item.seqNo)}//
            onChange={(event) => handleChangeCheckBox(event, item.seqNo)}
          />
          <label htmlFor={item.seqNo} />
        </td>
        <td>{item.name}</td>
        <td>{item.phoneNumber}</td>
        <td>{dayjs(item.fromDate).format(CONSTANT.FORMAT.DATE_ONLY_HYPHEN2)} ~{dayjs(item.toDate).format(CONSTANT.FORMAT.DATE_ONLY_HYPHEN2)}</td>
        <td>{!isEmpty(item.item) ? item.item : item.itemDetail}</td>
        <td>{!isNull(item.supplyDetail) ? `${item.supply},${item.supplyDetail}` : item.supply}</td>
        <td>{item.address}</td>
        <td onClick={() => handleClickOrderCopy(item)}>오더복사</td>
      </tr>
    ))}
    </tbody>

  )
}

export default TableBody
