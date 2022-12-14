import React from 'react';
import {Button, ConfigProvider, Form, Slider} from 'antd';
import {SketchPicker} from 'react-color';
import intl from "react-intl-universal";
import {setToken} from "../../component/redux/userTokenSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useStyles} from "../../styles/webStyle";
import bg from './bg.jpg'
import {noRender, render} from "../../component/redux/isRenderWebSlice";

type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
    colorError: string;
    gaussianBlur: number;
};

const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: '#1677ff',
    colorError: '#f32401',
    gaussianBlur: 40,
};

const TokenThemeSetting = () => {

    const navigate = useNavigate();

    const classes = useStyles();

    const [form] = Form.useForm();

    const [data, setData] = React.useState<ThemeData>(defaultData);

    const dispatch = useDispatch();

    const onFinish = (values: any) => {
        dispatch(noRender())
        dispatch(setToken({
            borderRadius: values.borderRadius,
            colorPrimary: values.colorPrimary.hex,
            gaussianBlur: values.gaussianBlur,
        }))
        setTimeout(() => {
            setTokenSuccess()
        }, 1000)
    }

    const setTokenSuccess = () => {
        dispatch(render())
    }

    return (
        <ConfigProvider
            theme={{token: {colorPrimary: data.colorPrimary, borderRadius: data.borderRadius}}}
        >
            <Form
                form={form}
                onValuesChange={(changedValues, allValues) => {
                    const colorObj = changedValues?.colorPrimary
                        ? {colorPrimary: allValues?.colorPrimary?.hex}
                        : {};
                    setData({
                        ...allValues,
                        ...colorObj,
                    });
                }}
                name="theme"
                layout="vertical"
                onFinish={onFinish}
                initialValues={defaultData}
            >
                <Form.Item valuePropName="color" name="colorPrimary" label={intl.get('primaryColor')}>
                    <SketchPicker/>
                </Form.Item>
                <Form.Item name="borderRadius" label={intl.get('borderRadius')}>
                    <Slider min={0} max={16}/>
                </Form.Item>
                <div className={classes.settingGaussianBlurShowDiv}>
                    <img src={bg} alt="????????????" className={classes.settingGaussianBlurImg}/>
                    <div className={classes.settingGaussianBlurCard} style={{
                        backdropFilter: `blur(${data.gaussianBlur}px) saturate(180%)`,
                    }}/>
                </div>
                <Form.Item name="gaussianBlur" label={intl.get('gaussianBlurNumber')}>
                    <Slider min={0} max={100}/>
                </Form.Item>
                <Form.Item name="submit">
                    <Button htmlType={"submit"} type="primary">{intl.get('submit')}</Button>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};

export default TokenThemeSetting;
