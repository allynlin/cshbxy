import React from 'react';
import {Button, ConfigProvider, Form, InputNumber} from 'antd';
import {SketchPicker} from 'react-color';
import intl from "react-intl-universal";
import {setToken} from "../../component/redux/userTokenSlice";
import {useDispatch} from "react-redux";

type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
};

const defaultData: ThemeData = {
    borderRadius: 6,
    colorPrimary: '#1677ff',
};

export default () => {
    const [form] = Form.useForm();

    const [data, setData] = React.useState<ThemeData>(defaultData);

    const dispatch = useDispatch();

    const onFinish = (values: any) => {
        dispatch(setToken({
            borderRadius: values.borderRadius,
            colorPrimary: values.colorPrimary.hex
        }))
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
                onFinish={onFinish}
                initialValues={defaultData}
                labelCol={{span: 4}}
                wrapperCol={{span: 20}}
            >
                <Form.Item valuePropName="color" name="colorPrimary" label={intl.get('primaryColor')}>
                    <SketchPicker/>
                </Form.Item>
                <Form.Item name="borderRadius" label={intl.get('borderRadius')}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item name="submit" wrapperCol={{offset: 4, span: 20}}>
                    <Button htmlType={"submit"} type="primary">{intl.get('submit')}</Button>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};
