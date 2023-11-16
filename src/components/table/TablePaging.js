import {useCallback} from "react";
import {useRecoilState} from "recoil";
import {deliveryOrderListPageQueryAtom} from "../../atom/Atom";

const TablePaging = () => {
    const [listPageQueryAtom, setListPageQueryAtom] = useRecoilState(deliveryOrderListPageQueryAtom)

    const handleClickFirst = useCallback(()=>{
        setListPageQueryAtom({
            ...listPageQueryAtom,
            page:1
        })
    },[listPageQueryAtom])

    const handleClickPrev = useCallback(()=>{
        if (listPageQueryAtom.page - 1 < 1) return;
        setListPageQueryAtom({
            ...listPageQueryAtom,
            page: listPageQueryAtom.page - 1
        })
    },[listPageQueryAtom])

    const handleClickNext = useCallback(()=>{
        if (listPageQueryAtom.page + 1 > listPageQueryAtom.totalPage) return;
        setListPageQueryAtom({
            ...listPageQueryAtom,
            page: listPageQueryAtom.page +1
        })
    },[listPageQueryAtom])

    const handleClickLast = useCallback(()=>{
        setListPageQueryAtom({
            ...listPageQueryAtom,
            page: listPageQueryAtom.totalPage
        })
    },[listPageQueryAtom])

    return(
        <div>
            <button onClick={handleClickFirst}>«</button>
            <button onClick={handleClickPrev}>‹</button>
            <span>{listPageQueryAtom.page}</span>
            <button onClick={handleClickNext}>›</button>
            <button onClick={handleClickLast}>»</button>
            <span> {`page ${listPageQueryAtom.page} of ${listPageQueryAtom.totalPage}`}</span>
        </div>
    )
}

export default TablePaging