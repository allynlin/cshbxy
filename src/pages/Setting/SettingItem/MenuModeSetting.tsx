import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {inline, vertical} from "../../../component/redux/menuModeSlice";

const MenuModeSetting = () => {

    const dispatch = useDispatch();

    const menuModeSlice = useSelector((state: any) => state.menuMode.value)

    const onChange = (e: any) => {
        dispatch(e === '水平' ? inline() : vertical())
    };

    return (
        <Segmented
            defaultValue={menuModeSlice === 'inline' ? "水平" : "垂直"}
            options={['水平', '垂直']}
            onChange={(e: any) => onChange(e)}
        />
    );
};

export default MenuModeSetting;
