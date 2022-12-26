import React from 'react';
import ThemeSetting from "./MobileThemeSetting";
import MobileUserNameSetting from "./MobileUserNameSetting";
import MobilePasswordSetting from "./MobilePasswordSetting";
import {Dialog, List, Toast} from 'antd-mobile'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import {version} from '../../baseInfo'
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import {useStyles} from "../../styles/mobileStyle";

const Setting = () => {

    const classes = useStyles();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLogin = useSelector((state: any) => state.isLogin.value)

    return (
        <>
            <List header='用户设置'>
                <MobileUserNameSetting/>
                <MobilePasswordSetting/>
            </List>
            <List header='基本设置'>
                <ThemeSetting/>
                {isLogin ? <List.Item onClick={() => {
                    Dialog.confirm({
                        content: '确认退出吗？',
                        cancelText: '取消',
                        confirmText: '确认',
                        onConfirm: () => {
                            dispatch(logout())
                            dispatch(all())
                            Cookie.remove('cshbxy-oa-password');
                            Cookie.remove('cshbxy-oa-token');
                            navigate('/m/login')
                            Toast.show({
                                icon: 'success',
                                content: '退出成功'
                            })
                        },
                    })
                }}>
                    退出登录
                </List.Item> : null}
                <List.Item clickable onClick={() => navigate('/home')}>
                    前往 Web 端
                </List.Item>
            </List>
            <p className={classes.copy}>
                系统版本号：{version}
                <br/>
                OA 系统 &copy; 2022-2023 Created by allynlin
            </p>
        </>
    )
};

export default Setting;
