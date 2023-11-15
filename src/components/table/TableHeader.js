import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckBox } from './styledComponents';
import { useDispatch, useSelector } from 'react-redux';
import { selectedAparts, selectedUsers } from '../reducers/SiteReducer';
import { isEqual } from 'lodash';

const TableHeader = ({
  tableHeaders,
  handleAction,
  active,
  allCheckBox,
  data,
  pageDate = [],
  tableType,
}) => {
  const { t } = useTranslation();
  const selectedUsersIds = useSelector((state) => state?.site?.selectedUsersIds);
  const selectedSitesIds = useSelector((state) => state?.site?.selectedSitesIds);
  const dispatch = useDispatch();
  const [activeAction, setActiveAction] = useState(active);
  const [orderBy, setOrderBy] = useState('asc');

  useEffect(() => {
    setActiveAction(active);
  }, [active]);

  const raiseSort = useCallback((sort) => {
    let sortColumn = { ...sortColumn };
    //선택된 분류가 현재 분류와 같으면 내림차 순이면 오름차 순으로 오름차 순이면 내림차순으로 바꿔준다.
    if (sortColumn.path === sort)
      sortColumn = { path: sort, order: sortColumn.order === 'asc' ? 'desc' : 'asc' };
    //선택 분류가 현재 분류와 같지 않으면 선택 분류로 바꾸고 무조건 오름차 순으로 바꾸어준다.
    else {
      sortColumn = { path: sort, order: 'asc' };
    }
  }, []);

  const handleChangeSort = useCallback((event, property) => {}, []);

  const CheckAllSelectedId = (selectedIds, data) => {
    if (!allCheckBox) return;
    return data.length === selectedIds?.length;
  };

  const countData = useMemo(
    () =>
      CheckAllSelectedId(
        isEqual(tableType, 'settingTotal') ? selectedSitesIds : selectedUsersIds,
        pageDate
      ),
    [selectedUsersIds, selectedSitesIds, pageDate]
  );

  const handleAllCheckBox = async (event) => {
    let selectedIds = [];
    if (event.target.checked) {
      selectedIds = pageDate.map((user) => user.id);
    }
    if (isEqual(tableType, 'settingTotal')) {
      await dispatch(selectedAparts(selectedIds));
    } else {
      await dispatch(selectedUsers(selectedIds));
    }
  };

  const onclickAction = useCallback(() => {
    setActiveAction(true);
    handleAction();
  }, [activeAction, active]);

  return (
    <thead className={'tblHeader'}>
      <tr>
        {allCheckBox && (
          <th style={{ width: '56px' }}>
            <CheckBox
              id={'all'}
              checked={countData}
              onChange={(event) => handleAllCheckBox(event)}
            />
            <label htmlFor="all"></label>
          </th>
        )}
        {tableHeaders.map((header) => {
          return (
            <th key={header.id} onClick={handleChangeSort} style={{ width: header.width }}>
              {t(header.label)}
              {header.sort && (
                <span className={'sortBtn'}>
                  {isEqual(orderBy, 'asc') ? t('오름차순') : t('내림차순')}
                </span>
              )}
              {header.action && (
                <>
                  {isEqual(header.id, 'type') ? (
                    <span className={'typeActionBtn'} onClick={onclickAction} />
                  ) : (
                    <span
                      className={!activeAction ? 'cardActionBtn' : 'cardActionBtn active'}
                      onClick={onclickAction}
                    />
                  )}
                </>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
