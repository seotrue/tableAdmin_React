import { atom } from 'recoil';

export const deliveryOrderListAtom = atom({
  key: '#deliveryOrderListAtom',
  default: [],
});

export const deliveryOrderListPageQueryAtom = atom({
  key: '#deliveryOrderListPageQueryAtom',
  default: {
    size: 20,
    page: 1,
    totalPage: 1,
  },
});

export const selectedOrderCopyAtom = atom({
  key: '#selectedOrderCopyAtom',
  default: {
    seqNo: null,
    loadPlace: [],
  },
});

export const selectedOrderIdsAtom = atom({
  key: '#selectedOrderIdsAtom',
  default: [],
});

export const loadPlaceAtom = atom({
  key: '#loadPlaceAtom',
  default: [{ name: '', address: '', date: '' }],
});
