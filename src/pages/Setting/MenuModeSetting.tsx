import type {RadioChangeEvent} from 'antd';
import {Radio, Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {inline, vertical} from "../../component/redux/menuModeSlice";
import intl from "react-intl-universal";

const MenuModeSetting = () => {

    const dispatch = useDispatch();

    const menuModeSlice = useSelector((state: any) => state.menuMode.value)

    const onChange = (e: RadioChangeEvent) => {
        dispatch(e.target.value === 'inline' ? inline() : vertical())
    };

    return (
        <Radio.Group onChange={onChange} value={menuModeSlice}>
            <Radio value={"inline"}>{intl.get('horizontalMenu')}</Radio>
            <Radio value={"vertical"}>{intl.get('verticalMenu')}</Radio>
        </Radio.Group>
    );
};

export default MenuModeSetting;
