import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { deliveryOrderListAtom, deliveryOrderListPageQueryAtom, selectedOrderIdsAtom } from 'atom/Atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Select from 'react-select';
import { useCallback, useEffect, useState } from 'react';
import TablePaging from './TablePaging';
import Button from 'components/common/Button';
import axios from 'axios';

const options = [
  { value: 20, label: '20개 보기' },
  { value: 50, label: '50개 보기' },
  { value: 100, label: '100개 보기' },
];
const Table = ({ onClickOderCopy }) => {
  const listAtom = useRecoilValue(deliveryOrderListAtom);
  const ids = useRecoilValue(selectedOrderIdsAtom);
  const [listPageQueryAtom, setListPageQueryAtom] = useRecoilState(deliveryOrderListPageQueryAtom);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    const { size } = listPageQueryAtom;
    const totalPage = Math.ceil(listAtom.length / size);
    setListPageQueryAtom({
      ...listPageQueryAtom,
      totalPage,
    });
  }, [listAtom]);

  const handleChangeSelectOption = useCallback(
    (newValue) => {
      // 디스패치
      setSelectedOption(newValue);
      setListPageQueryAtom({
        size: newValue.value,
        page: 1,
        totalPage: Math.ceil(listAtom.length / newValue.value),
      });
    },
    [listAtom],
  );

  const handleAllCheckBox = (data) => {
    setIsAllChecked(data);
  };

  const handleDelete = useCallback(async () => {
    try {
      const res = await axios.delete('order', { data: [...ids] });
      console.log(res, 'res');
    } catch (e) {
      console.error(e);
    }
  }, [ids]);

  return (
    <>
      <Button onEvent={handleDelete} text={'삭제'} />
      <Select
        defaultValue={selectedOption}
        onChange={(newValue, actionMeta) => handleChangeSelectOption(newValue)}
        options={options}
      />
      <table>
        <TableHeader onHandleAllCheckBox={handleAllCheckBox} />
        <TableBody onClickOderCopy={onClickOderCopy} isAllChecked={isAllChecked} />
      </table>
      <TablePaging />
    </>
  );
};

export default Table;
