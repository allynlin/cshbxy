import React from "react";
import {Alert, Radio, Tooltip, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import intl from "react-intl-universal";
import {setToken} from "../../../component/redux/userTokenSlice";
import TokenThemeSetting from "./TokenThemeSetting";
import {ExperimentTwoTone} from "@ant-design/icons";
import {useGaussianBlurStyles} from "../../../styles/gaussianBlurStyle";
import TableSetting from "./TableSetting";

const {Title, Paragraph} = Typography;

interface TokenSettingProps {
    colorPrimary: string;
    borderRadius: number;
    colorError: string;
    gaussianBlur: number;
}

const defaultTheme: TokenSettingProps = {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    colorError: '#f32401',
    gaussianBlur: 40
}

const greenTheme: TokenSettingProps = {
    colorPrimary: '#00b96b',
    borderRadius: 6,
    colorError: '#f32401',
    gaussianBlur: 40
}

const pinkTheme: TokenSettingProps = {
    colorPrimary: '#ed4192',
    borderRadius: 10,
    colorError: '#f32401',
    gaussianBlur: 40
}

export default function TokenSetting() {

    const gaussianBlurClasses = useGaussianBlurStyles();

    const dispatch = useDispatch();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const changeDefaultTheme = (e: any) => {
        switch (e.target.value) {
            case "default":
                dispatch(setToken(defaultTheme))
                break
            case "green":
                dispatch(setToken(greenTheme))
                break
            case "pink":
                dispatch(setToken(pinkTheme))
                break
            default:
                dispatch(setToken(defaultTheme))
        }
    }

    return (
        <Typography>
            <Title level={2}>
                {intl.get('tokenSetting')}&nbsp;
                <Tooltip title={intl.get('themeWarning')}
                         overlayClassName={gaussianBlur ? gaussianBlurClasses.gaussianBlurTooltip : ''}>
                    <ExperimentTwoTone/>
                </Tooltip>
            </Title>
            <Paragraph>{intl.get('token-1')}</Paragraph>
            <Paragraph>{intl.get('token-2')}</Paragraph>
            <Paragraph>{intl.get('token-3')}</Paragraph>
            <Alert message={intl.get('token-4')} type="warning"/>
            <Radio.Group defaultValue="default" buttonStyle="solid" onChange={changeDefaultTheme}
                         style={{marginTop: 16}}>
                <Radio.Button value="default">默认</Radio.Button>
                <Radio.Button value="green">知识协作</Radio.Button>
                <Radio.Button value="pink">桃花缘</Radio.Button>
            </Radio.Group>
            <Title level={3}>{intl.get('themeSetting')}</Title>
            <Paragraph>{intl.get('theme-1')}</Paragraph>
            <div style={{padding: 16}}>
                <TokenThemeSetting/>
            </div>
            <Title level={3}>{intl.get('tableSetting')}</Title>
            <Paragraph>{intl.get('table-1')}</Paragraph>
            <div style={{padding: 16}}>
                <TableSetting/>
            </div>
        </Typography>
    );
}
