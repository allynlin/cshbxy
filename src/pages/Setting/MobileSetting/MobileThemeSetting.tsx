import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {darkTheme, lightTheme, sysTheme} from "../../../component/redux/sysColorSlice";
import {ActionSheet, List} from "antd-mobile";
import type {Action} from 'antd-mobile/es/components/action-sheet'

const ThemeSetting = () => {

    const [visible, setVisible] = useState(false);
    const [themeColor, setThemeColor] = useState('');

    const dispatch = useDispatch();

    const sysColor = useSelector((state: any) => state.sysColor.value)

    useEffect(() => {
        switch (sysColor) {
            case 'light':
                setThemeColor('浅色模式')
                break;
            case 'dark':
                setThemeColor('深色模式')
                break;
            case 'sys':
                setThemeColor('跟随系统')
                break;
            default:
                setThemeColor('状态异常')
        }
    }, [sysColor])

    const actions: Action[] = [
        {
            text: '浅色模式',
            key: 'light',
            onClick: () => {
                dispatch(lightTheme());
                setVisible(false)
            },
        }, {
            text: '深色模式',
            key: 'dark',
            onClick: () => {
                dispatch(darkTheme());
                setVisible(false)

            },
        }, {
            text: '跟随系统',
            key: 'sys',
            onClick: () => {
                dispatch(sysTheme());
                setVisible(false)
            },
        },
    ]


    return (
        <>
            <List.Item extra={themeColor} clickable onClick={() => setVisible(true)}>
                系统外观
            </List.Item>
            <ActionSheet
                visible={visible}
                actions={actions}
                onClose={() => setVisible(false)}
            />
        </>
    );
};

export default ThemeSetting;
