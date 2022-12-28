import React, {useState} from "react";
import {Typography, Tag, Segmented, Alert, Tooltip} from "antd";
import {useDispatch} from "react-redux";
import intl from "react-intl-universal";
import {setToken} from "../../component/redux/userTokenSlice";
import TokenThemeSetting from "./TokenThemeSetting";
import {ExperimentTwoTone} from "@ant-design/icons";

const {Title, Paragraph} = Typography;

interface TokenSettingProps {
    colorPrimary: string;
    borderRadius: number;
    colorError: string;
}

const defaultTheme: TokenSettingProps = {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    colorError: '#f32401'
}

const greenTheme: TokenSettingProps = {
    colorPrimary: '#00b96b',
    borderRadius: 6,
    colorError: '#f32401'
}

const pinkTheme: TokenSettingProps = {
    colorPrimary: '#ed4192',
    borderRadius: 10,
    colorError: '#f32401'
}

export default function TokenSetting() {

    const [value, setValue] = useState<string | number>('');

    const dispatch = useDispatch();

    const handleChange = (value: string) => {
        setValue(value);
        switch (value) {
            case '默认':
                dispatch(setToken(defaultTheme))
                break;
            case '知识协作':
                dispatch(setToken(greenTheme))
                break;
            case '桃花缘':
                dispatch(setToken(pinkTheme))
                break;
            default:
                dispatch(setToken(defaultTheme))
        }
    }

    return (
        <Typography>
            <Title level={3} style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                {intl.get('tokenSetting')}&nbsp;
                <Tooltip title={intl.get('themeWarning')}>
                    <ExperimentTwoTone/>
                </Tooltip>
            </Title>
            <Paragraph>{intl.get('token-1')}</Paragraph>
            <Paragraph>{intl.get('token-2')}</Paragraph>
            <Paragraph>{intl.get('token-3')}</Paragraph>
            <Alert message={intl.get('token-4')} type="warning"/>
            <Segmented style={{marginTop: 16}} value={value} block options={['默认', '知识协作', '桃花缘']}
                       onChange={(e: any) => handleChange(e)}/>
            <div style={{padding: 16}}>
                <TokenThemeSetting/>
            </div>
        </Typography>
    );
}
