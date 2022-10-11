import type {RadioChangeEvent} from 'antd';
import {Radio} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {inline, vertical} from "../../component/redux/menuModeSlice";
import {LStorage} from "../../component/localStrong";

const MenuModeSetting = () => {

    const dispatch = useDispatch();

    const menuModeSlice = useSelector((state: { menuMode: { value: 'inline' | 'vertical' } }) => state.menuMode.value)

    const onChange = (e: RadioChangeEvent) => {
        dispatch(e.target.value === 'inline' ? inline() : vertical())
        LStorage.set('menuMode', e.target.value)
    };

    return (
        <Radio.Group onChange={onChange} value={menuModeSlice}>
            <Radio value={"inline"}>水平</Radio>
            <Radio value={"vertical"}>垂直</Radio>
        </Radio.Group>
    );
};

export default MenuModeSetting;