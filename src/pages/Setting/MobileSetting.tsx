import React from 'react';
import ThemeSetting from "./MobileThemeSetting";
import {Dialog, List, Toast} from 'antd-mobile'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Cookie from "js-cookie";
import {version} from '../../baseInfo'
import './mobileSetting.scss'
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";

const Setting = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLogin = useSelector((state: any) => state.isLogin.value)

    const serverVersion = useSelector((state: any) => state.serverVersion.value);

    return (
        <>
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
            </List>
            <p className={'copy'}>
                服务器版本号：{serverVersion}
                <br/>
                系统版本号：{version}
                <br/>
                OA 系统 &copy; 2022-2023 Created by allynlin
            </p>

        </>
    )
};

export default Setting;
