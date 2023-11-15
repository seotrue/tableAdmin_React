import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';
const tableHeaders = [
  { id: 'number', label: 'No',  width: '56px' },
  { id: 'name', label: '이름',  width: '8%' },
  { id: 'title', label: '휴대폰번호',  width: '8%' },
  { id: 'in', label: '날짜 ',  width: '15%' },
  { id: 'out', label: '품목 ',  width: '15%' },
  { id: 'work_hours', label: '물량',  width: '8%' },
  { id: 'desc', label: '출근지 ', },
  { id: 'desc', label: '오더복사 ' },
];
const TableHeader = ({
  active,
  allCheckBox,
  pageDate = [],
  tableType,
}) => {
  const [activeAction, setActiveAction] = useState(active);

  const CheckAllSelectedId = (selectedIds, data) => {
    if (!allCheckBox) return;
    return data.length === selectedIds?.length;
  };


  const handleAllCheckBox = async (event) => {
    let selectedIds = [];
    // if (event.target.checked) {
    //   selectedIds = pageDate.map((user) => user.id);
    // }
    // if (isEqual(tableType, 'settingTotal')) {
    //   await dispatch(selectedAparts(selectedIds));
    // } else {
    //   await dispatch(selectedUsers(selectedIds));
    // }
  };


  return (
    <thead className={'tblHeader'}>
      <tr>
        {allCheckBox && (
          <th style={{ width: '56px' }}>
            <input
                type={'checkbox'}
                id={'all'}
                onChange={(event) => handleAllCheckBox(event)}
            />
            <label htmlFor="all"></label>
          </th>
        )}
        {tableHeaders.map((header) => {
          return (
            <th key={header.id}  style={{ width: header.width }}>
              {header.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
