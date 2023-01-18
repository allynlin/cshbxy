import React, { useEffect, useState } from 'react';
import { Result, Progress } from 'antd';
import { useStyles } from "../../styles/webStyle";
import logo from '../../images/logo.png';
import { LStorage } from "../../component/localStrong";
import { darkTheme, lightTheme, sysTheme } from "../../component/redux/sysColorSlice";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";
import { Chinese, English } from "../../component/redux/userLanguageSlice";
import { inline, vertical } from "../../component/redux/menuModeSlice";
import { close, open } from "../../component/redux/gaussianBlurSlice";
import { setToken } from "../../component/redux/userTokenSlice";
import intl from "react-intl-universal";
import { checkUser } from "../../component/axios/api";
import { setUser } from "../../component/redux/userInfoSlice";
import { login } from "../../component/redux/isLoginSlice";
import { Department, Employee, Leader } from "../../component/redux/userTypeSlice";
import { useNavigate } from "react-router-dom";
import { render } from "../../component/redux/isRenderWebSlice";
import { SStorage } from '../../component/localStrong';

const RenderResult: React.FC = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [percent, setPercent] = useState<number>(0);
    const [title, setTitle] = useState<string>(intl.get('useSettingIng'));

    useEffect(() => {
        getLanguageSetting()
        getSysColorSetting()
        getToken()
        getGaussianBlurSetting()
        getThemeToken()
        getMenuModeSetting()
    }, [])

    const setState = (newPercent: number) => {
        setPercent(newPercent)
        if (newPercent === 0)
            dispatch(render())
    }

    const getLanguageSetting = () => {
        setTitle(intl.get('getLanguageSettingIng'))
        Cookie.get('cshbxy-oa-language') === "en_US" ? dispatch(English()) : dispatch(Chinese())
        setPercent(10)
        setTimeout(() => {
            setState(10)
        }, 500);
    }

    const getSysColorSetting = () => {
        setTitle(intl.get('getSysThemeIng'))
        // 如果在 localStrong 中有颜色设置就使用 localStrong 中的颜色设置
        const sysColor = LStorage.get('cshbxy-oa-sysColor');
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
        setTimeout(() => {
            setState(30)
        }, 1000);
    }

    const getToken = () => {
        // 从 Cookie 中获取 token，如果获取到就向后端发送请求验证 token 是否有效，如果有效就继续，否之跳转用户登录页面
        const token = Cookie.get('cshbxy-oa-token');
        if (token) {
            setTitle(intl.get('autoLoginIng'))
            setTimeout(() => {
                setState(50)
            }, 1500);
            checkUser().then(res => {
                // 如果校验失败，则提示用户 token 失效，跳转到登录页面
                if (res.code !== 200) {
                    dispatch(render())
                    setTitle(intl.get('autoLoginFailed'))
                    navigate('/login')
                    return
                }
                setTitle(intl.get('autoLoginSuccess'))
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
            })
        }
    }

    const getGaussianBlurSetting = () => {
        setTitle(intl.get('getGaussianBlurSettingIng'))
        LStorage.get('cshbxy-oa-gaussianBlur') === true ? dispatch(open()) : dispatch(close())
        setTimeout(() => {
            setState(80)
        }, 2000);
    }

    const getThemeToken = () => {
        setTitle(intl.get('getThemeTokenIng'))
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
        setTimeout(() => {
            setState(90)
        }, 2500);
    }

    const getMenuModeSetting = () => {
        setTitle(intl.get('getMenuModeSettingIng'))
        LStorage.get('cshbxy-oa-menuMode') === 'vertical' ? dispatch(vertical()) : dispatch(inline())
        setTimeout(() => {
            setState(0)
        }, 3000);
    }

    return (
        <div className={classes.flexCenter + ' ' + classes.webWaiting}>
            <Result
                icon={<img src={logo} alt="logo" className={classes.webWaitingImg} />}
                title={title}
            />
            <Progress className={classes.webWaitingProgress} percent={percent} status="active"
                strokeColor={{ from: '#108ee9', to: '#87d068' }} />
        </div>
    );
};

export default RenderResult;
