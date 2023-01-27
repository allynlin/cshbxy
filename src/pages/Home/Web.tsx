import {HeaderMenu, SliderMenu} from "./RenderMenu";
import {version} from "../../baseInfo";
import RenderLogOut from "./RenderLogOut";
import WebComponent from "./WebComponent";
import React, {useEffect, useState} from 'react';
import {Result} from 'antd';
import logo from '../../images/logo.png';
import {LStorage, SStorage} from "../../component/localStrong";
import {darkTheme, lightTheme, sysTheme} from "../../component/redux/sysColorSlice";
import Cookie from "js-cookie";
import {Chinese, English} from "../../component/redux/userLanguageSlice";
import {inline, vertical} from "../../component/redux/menuModeSlice";
import {close, open} from "../../component/redux/gaussianBlurSlice";
import {setToken} from "../../component/redux/userTokenSlice";
import intl from "react-intl-universal";
import {checkUser, findUserSetting} from "../../component/axios/api";
import {setUser} from "../../component/redux/userInfoSlice";
import {login} from "../../component/redux/isLoginSlice";
import {Department, Employee, Leader} from "../../component/redux/userTypeSlice";
import {useStyles} from "./style";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setTable} from "../../component/redux/userTableSlice";
import {hide, show} from "../../component/redux/isShowFloatButtonSlice";
import ChangeSystem from "../../component/ChangeSystem";

const App: React.FC = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isRender, setIsRender] = useState(false);

    const isShowFloatButton = useSelector((state: any) => state.isShowFloatButton.value);

    useEffect(() => {
        getLanguageSetting()
        getThemeToken()
        getToken()
    }, [])

    const getLSSetting = () => {
        const setting = LStorage.get('setting');
        if (setting)
            getUserSettingNotLogin(setting)
    }

    const getUserSettingNotLogin = (setting: any) => {
        const userSetting = JSON.parse(setting);
        const {menuMode, gaussianBlur, showFloatButton, theme} = userSetting;
        getSysColorSetting(theme)
        gaussianBlur ? dispatch(open()) : dispatch(close())
        menuMode === 'vertical' ? dispatch(vertical()) : dispatch(inline())
        showFloatButton ? dispatch(show()) : dispatch(hide())
    }

    const getUserSetting = (isLogin: boolean) => {
        if (!isLogin) {
            getLSSetting()
            return
        }
        findUserSetting(SStorage.get('userInfo').uid).then(res => {
            if (res.code !== 200) {
                getLSSetting()
                return
            }
            LStorage.set('setting', res.body)
            getUserSettingNotLogin(res.body)
        })
    }

    const getLanguageSetting = () => {
        Cookie.get('cshbxy-oa-language') === "en_US" ? dispatch(English()) : dispatch(Chinese())
    }

    const getSysColorSetting = (sysColor: any) => {
        switch (sysColor) {
            case 'light':
                dispatch(lightTheme());
                break;
            case 'dark':
                dispatch(darkTheme());
                break;
            case 'sys':
                dispatch(sysTheme());
                break;
        }
    }

    const getToken = () => {
        // 从 Cookie 中获取 token，如果获取到就向后端发送请求验证 token 是否有效，如果有效就继续，否之跳转用户登录页面
        const token = Cookie.get('cshbxy-oa-token');
        if (token) {
            checkUser().then(res => {
                // 如果校验失败，则提示用户 token 失效，跳转到登录页面
                if (res.code !== 200) {
                    getUserSetting(false)
                    setIsRender(true)
                    navigate('/login')
                    return
                }
                dispatch(setUser(res.body))
                dispatch(login())
                switch (res.body.userType) {
                    case 'Employee':
                        dispatch(Employee())
                        break
                    case 'Department':
                        dispatch(Department())
                        break
                    case 'Leader':
                        dispatch(Leader())
                        break
                }
                getUserSetting(true)
                setIsRender(true)
            })
            return
        }
        getUserSetting(false)
        setIsRender(true)
    }

    const getThemeToken = () => {
        // 从 LocalStrong 中获取主题颜色，用于页面整体自定义主题，如果没有就使用默认主题
        const userThemeToken = LStorage.get('cshbxy-oa-userToken')
        if (userThemeToken) {
            dispatch(setToken({
                colorPrimary: userThemeToken.colorPrimary,
                borderRadius: userThemeToken.borderRadius,
                // 错误颜色暂不支持自定义
                colorError: '#f32401',
                gaussianBlur: userThemeToken.gaussianBlur,
            }))
        }
        const userTableToken = LStorage.get('cshbxy-oa-userTable');
        if (userTableToken) {
            dispatch(setTable({
                tableType: userTableToken.tableType,
                defaultPageSize: userTableToken.defaultPageSize,
            }))
        }
    }

    return (
        <>
            {isShowFloatButton ? <ChangeSystem/> : null}
            {isRender ? <WebComponent
                    title="长沙星辰软件有限公司 OA 系统"
                    copy={`长沙星辰软件有限公司 OA &copy; 2022-2023 Created by allynlin Version：${version}`}
                    menu={<SliderMenu/>}
                    headMenu={<HeaderMenu/>}
                    logOut={<RenderLogOut/>}
                /> :
                (
                    <div className={classes.flexCenter + ' ' + classes.webWaiting}>
                        <Result
                            icon={<img src={logo} alt="logo" className={classes.webWaitingImg}/>}
                            title={intl.get('loading')}
                        />
                    </div>
                )
            }
        </>
    );
};

export default App;
