import React, {useState} from 'react';
import {App, Button, Form, InputNumber, Modal, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import intl from "react-intl-universal";
import BraftEditor from "braft-editor";

import {addProcurement} from "../../component/axios/api";
import {useStyles} from "../../styles/webStyle";
import {controls} from "../../baseInfo";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

const {Title, Paragraph} = Typography;

const ProcurementForm = () => {

    const classes = useStyles();
    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const {message} = App.useApp();

    const navigate = useNavigate();
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 监听表单数据
    const [form] = Form.useForm();
    const items = Form.useWatch('items', form);
    const price = Form.useWatch('price', form);
    const reason = Form.useWatch('reason', form);

    // 表单提交
    const submitForm = () => {
        addProcurement(items.toHTML(), price, reason.toHTML()).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: intl.get('procurementApply') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/procurement-record',
                        againTitle: intl.get('continueSubmit')
                    }
                }
            })
        }).finally(() => {
            setConfirmLoading(false);
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        submitForm();
    };

    const onFinish = () => {
        setIsModalVisible(true)
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className={classes.cshbxy100Per}>
            <Modal
                title={intl.get('confirm')}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
                mask={!gaussianBlur}
            >
                <Typography>
                    <Paragraph>{intl.get('procurementItem')}：</Paragraph>
                    <div className={classes.outPutHtml} dangerouslySetInnerHTML={{__html: items?.toHTML()}}/>
                    <Paragraph>{intl.get('procurementPrice')}：{price}</Paragraph>
                    <Paragraph>{intl.get('reason')}：</Paragraph>
                    <div className={classes.outPutHtml} dangerouslySetInnerHTML={{__html: reason?.toHTML()}}/>
                </Typography>
            </Modal>
            <Title level={2}>{intl.get('procurementApply')}</Title>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label={intl.get('procurementItem')}
                    name="items"
                    rules={[{required: true, message: intl.get('pleaseInputProcurementItem')}]}
                >
                    <BraftEditor
                        // @ts-ignore
                        controls={controls}
                        placeholder={intl.get('pleaseInputProcurementItem')}
                    />
                </Form.Item>

                <Form.Item
                    label={intl.get('procurementPrice')}
                    name="price"
                    rules={[{required: true, message: intl.get('pleaseInputProcurementPrice')}]}
                >
                    <InputNumber addonAfter={'¥'}/>
                </Form.Item>

                <Form.Item
                    label={intl.get('reason')}
                    name="reason"
                    rules={[{required: true, message: intl.get('pleaseInputReason')}]}
                >
                    <BraftEditor
                        // @ts-ignore
                        controls={controls}
                        placeholder={intl.get('pleaseInputReason')}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {intl.get('submit')}
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        {intl.get('reset')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const Procurement = () => {
    return (
        <App>
            <ProcurementForm/>
        </App>
    )
}

export default Procurement;
