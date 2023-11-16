import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';
import { useRecoilValue } from 'recoil';
import { deliveryOrderListPageQueryAtom, selectedOrderIdsAtom } from 'atom/Atom';
const tableHeaders = [
  { id: 'all',  width: '56px' },
  { id: 'name', label: '이름',  width: '8%' },
  { id: 'phone', label: '휴대폰번호',  width: '8%' },
  { id: 'data', label: '날짜 ',  width: '15%' },
  { id: 'product', label: '품목 ',  width: '15%' },
  { id: 'productNum', label: '물량',  width: '8%' },
  { id: 'place', label: '출근지 ', },
  { id: 'copy', label: '오더복사 ' },
];
const TableHeader = ({onHandleAllCheckBox}) => {
  const selectedOrderIds = useRecoilValue(selectedOrderIdsAtom)
  const query = useRecoilValue(deliveryOrderListPageQueryAtom)
  const [allCheck,setAllCheck] = useState(false)

  console.log(selectedOrderIds)

  useEffect(()=>{
    setAllCheck(selectedOrderIds.length === query.size)
  },[selectedOrderIds,query])

  const handleAllCheckBox = async (event) => {
    setAllCheck(event.target.checked)
    onHandleAllCheckBox(event.target.checked)
  };

  return (
    <thead className={'tblHeader'}>
      <tr>
        <th style={{ width: '56px' }}>
          <input
            type={'checkbox'}
            id={'all'}
            checked={allCheck}
            onChange={(event) => handleAllCheckBox(event)}
          />
          <label htmlFor="all"></label>
        </th>
        {tableHeaders.map((header) => {
          return header.id !== 'all' ?
           (
            <th key={header.id}  style={{ width: header.width }}>
              {header.label}
            </th>
          )
          :
          ''
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
