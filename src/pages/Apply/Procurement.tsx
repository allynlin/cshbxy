import React, {useState} from 'react';
import {App, Button, Form, Input, InputNumber, Modal, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';

import {addProcurement} from "../../component/axios/api";
import {useStyles} from "../../styles/webStyle";

const {Title, Paragraph} = Typography;
const {TextArea} = Input;

const ProcurementForm = () => {

    const classes = useStyles();

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
        addProcurement(items, price, reason).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: "采购申请提交成功",
                        describe: "等待审批",
                        toPage: "查看申请记录",
                        toURL: '/procurement-Record',
                        againTitle: "再次提交"
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
                title="确认"
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Typography>
                    <Paragraph>采购项：{items}</Paragraph>
                    <Paragraph>采购金额：{price}</Paragraph>
                    <Paragraph>原因：{reason}</Paragraph>
                </Typography>
            </Modal>
            <Title level={2}>采购申请</Title>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="采购项"
                    name="items"
                    rules={[{required: true, message: "请输入采购项"}]}
                >
                    <TextArea showCount rows={4} maxLength={1000} placeholder="请输入采购项"/>
                </Form.Item>

                <Form.Item
                    label="采购金额"
                    name="price"
                    rules={[{required: true, message: "请输入采购金额"}]}
                >
                    <InputNumber addonAfter={'¥'}/>
                </Form.Item>

                <Form.Item
                    label="原因"
                    name="reason"
                    rules={[{required: true, message: "请输入原因"}]}
                >
                    <TextArea showCount rows={4} maxLength={1000} placeholder="请输入原因"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>重置</Button>
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
