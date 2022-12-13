import React from "react";
import {Typography, Tag, Button, Form, Input, InputNumber, message, Radio, Alert, Modal} from "antd";
import './token.scss'
import {useDispatch, useSelector} from "react-redux";
import intl from "react-intl-universal";
import {setToken} from "../../component/redux/userTokenSlice";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const {Title, Text, Paragraph} = Typography;

interface TokenSettingProps {
    colorPrimary: string;
    borderRadius: number;
    colorError: string;
    colorSuccess: string;
    colorWarning: string;
}

const defaultTheme: TokenSettingProps = {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    colorError: '#f32401',
    colorSuccess: '#006c01',
    colorWarning: '#ff8d00',
}

const greenTheme: TokenSettingProps = {
    colorPrimary: '#00b96b',
    borderRadius: 6,
    colorError: '#f32401',
    colorSuccess: '#006c01',
    colorWarning: '#ff8d00',
}

const pinkTheme: TokenSettingProps = {
    colorPrimary: '#ed4192',
    borderRadius: 6,
    colorError: '#f32401',
    colorSuccess: '#006c01',
    colorWarning: '#ff8d00',
}

export default function TokenSetting() {

    const dispatch = useDispatch();

    const userToken = useSelector((state: any) => state.userToken.value)

    const [form] = Form.useForm();

    const onFinish = (values: TokenSettingProps) => {
        Modal.confirm({
            title: intl.get('changeThemeTitle'),
            icon: <ExclamationCircleOutlined/>,
            content: intl.get('changeThemeNotice'),
            okText: intl.get('confirm'),
            cancelText: intl.get('cancel'),
            onOk() {
                dispatch(setToken(values))
                setTimeout(() => {
                    message.success(intl.get('changeSuccess'))
                }, 1000)
            }
        });
    };

    const changeTheme = (e: string) => {
        switch (e) {
            case 'default':
                form.setFieldsValue(defaultTheme)
                break;
            case 'greenTheme':
                form.setFieldsValue(greenTheme)
                break;
            case 'pinkTheme':
                form.setFieldsValue(pinkTheme)
                break;
        }
    }

    return (
        <Typography>
            <Title level={3}>{intl.get('tokenSetting')} <Tag color={"warning"}>{intl.get('themeWarning')}</Tag></Title>
            <Paragraph>{intl.get('token-1')}</Paragraph>
            <Paragraph>{intl.get('token-2')}</Paragraph>
            <Paragraph>{intl.get('token-3')}</Paragraph>
            <Paragraph><Text strong>{intl.get('token-4')}</Text></Paragraph>
            <Alert message={intl.get('primaryThemeWarning')} type="warning"/>
            <div className={'component'}>
                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{
                        colorPrimary: userToken.colorPrimary,
                        borderRadius: userToken.borderRadius,
                        colorError: userToken.colorError,
                        colorSuccess: userToken.colorSuccess,
                        colorWarning: userToken.colorWarning,
                    }}
                >
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Radio.Group buttonStyle="solid"
                                     onChange={e => changeTheme(e.target.value)}>
                            <Radio.Button value="default">默认</Radio.Button>
                            <Radio.Button value="greenTheme">知识协作</Radio.Button>
                            <Radio.Button value="pinkTheme">桃花缘</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="主要颜色"
                        name="colorPrimary"
                        rules={[{required: true, message: intl.get('requiredItem')}]}
                    >
                        <Input type={"color"}/>
                    </Form.Item>

                    <Form.Item
                        label="错误颜色"
                        name="colorError"
                        rules={[{required: true, message: intl.get('requiredItem')}]}
                    >
                        <Input type={"color"}/>
                    </Form.Item>

                    <Form.Item
                        label="成功颜色"
                        name="colorSuccess"
                        rules={[{required: true, message: intl.get('requiredItem')}]}
                    >
                        <Input type={"color"}/>
                    </Form.Item>

                    <Form.Item
                        label="警告颜色"
                        name="colorWarning"
                        rules={[{required: true, message: intl.get('requiredItem')}]}
                    >
                        <Input type={"color"}/>
                    </Form.Item>

                    <Form.Item
                        label="圆角边框"
                        name="borderRadius"
                        rules={[{required: true, message: intl.get('requiredItem')}]}
                    >
                        <InputNumber min={0}/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button htmlType="reset" onClick={() => form.setFieldsValue(defaultTheme)}>
                            {intl.get('reset')}
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" htmlType="submit">
                            {intl.get('submit')}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Typography>
    );
}
