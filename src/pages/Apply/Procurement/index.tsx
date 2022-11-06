import {Button, Form, Input, InputNumber, message, Modal, Typography} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addProcurement} from "../../../component/axios/api";
import '../apply.scss';
import intl from "react-intl-universal";

const {Title} = Typography;

const ProcurementForm = () => {
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
        addProcurement(items, price, reason).then(res => {
            setConfirmLoading(false);
            navigate('/home/success', {
                state: {
                    object: {
                        title: intl.get('procurementApply') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/home/record/procurement',
                        againTitle: intl.get('continueSubmit')
                    }
                }
            })
        }).catch(err => {
            message.error(err.message);
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
        <div className={'apply-body'}>
            <Modal
                title={intl.get('confirm')}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{intl.get('procurementItem')}：{items}</p>
                <p>{intl.get('procurementPrice')}：{price}</p>
                <p>{intl.get('reason')}：{reason}</p>
            </Modal>
            <Title level={2} className={'tit'}>{intl.get('procurementApply')}</Title>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
            >
                <Form.Item
                    label={intl.get('procurementItem')}
                    name="items"
                    rules={[{required: true, message: intl.get('pleaseInputProcurementItem')}]}
                >
                    <Input.TextArea rows={4} placeholder={intl.get('pleaseInputProcurementItem')} showCount={true}
                                    maxLength={1000}/>
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
                    <Input.TextArea rows={4} placeholder={intl.get('pleaseInputReason')} showCount={true}
                                    maxLength={1000}/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}} style={{textAlign: "center"}}>
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

const Index = () => {
    return (
        <ProcurementForm/>
    )
}

export default Index;
