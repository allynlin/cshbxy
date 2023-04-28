import {Segmented} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {inline, vertical} from "../../../component/redux/menuModeSlice";
import {settingChange} from "../../../component/settingChange";

const MenuModeSetting = () => {

    const dispatch = useDispatch();

    const menuModeSlice = useSelector((state: any) => state.menuMode.value)

    const onChange = (e: any) => {
        switch (e) {
            case "水平（inline）":
                dispatch(inline())
                settingChange('menuMode', 'inline')
                break;
            case "垂直（vertical）":
                dispatch(vertical())
                settingChange('menuMode', 'vertical')
                break;
            default:
                dispatch(inline())
                settingChange('menuMode', 'inline')
        }
    };

    return (
        <Segmented
            defaultValue={menuModeSlice === 'inline' ? "水平（inline）" : "垂直（vertical）"}
            options={['水平（inline）', '垂直（vertical）']}
            onChange={(e: any) => onChange(e)}
        />
    );
};

export default MenuModeSetting;
