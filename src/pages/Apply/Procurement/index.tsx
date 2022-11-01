import {Button, Form, Input, InputNumber, message, Modal, Typography} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {teacherChangeDepartment,} from "../../../component/axios/api";
import '../apply.scss';

const {Title} = Typography;
const tableName = `purchasingapplicationteacher`;

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
        teacherChangeDepartment(items, price).then(res => {
            setConfirmLoading(false);
            message.success(res.msg);
            navigate('/home/teacher/record/departmentChange');
            navigate('/home/success', {
                state: {
                    object: {
                        title: '部门变更申请提交成功',
                        describe: '请等待管理员审批',
                        toPage: '查看审批记录',
                        toURL: '/home/record/departmentChange',
                    }
                }
            })
        }).catch(err => {
            setConfirmLoading(false);
        })
    }

    const RenderModal: React.FC = () => {
        return (
            <Modal
                title="确认提交"
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>采购物品：{items}</p>
                <p>采购费用：{price}</p>
                <p>采购原因：{reason}</p>
            </Modal>
        )
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        submitForm();
    };

    const onFinish = (values: any) => {
        setIsModalVisible(true)
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className={'body'}>
            <RenderModal/>
            <Title level={2} className={'tit'}>采购申请</Title>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
            >
                <Form.Item
                    label="采购物品"
                    name="items"
                    rules={[{required: true, message: '请输入采购物品'}]}
                >
                    <Input.TextArea rows={4} placeholder={"请输入采购物品，不超过1000字"} showCount={true}
                                    maxLength={1000}/>
                </Form.Item>

                <Form.Item
                    label="采购费用"
                    name="price"
                    rules={[{required: true, message: '请输入采购费用'}]}
                >
                    <InputNumber addonAfter={'¥'}/>
                </Form.Item>

                <Form.Item
                    label="采购原因"
                    name="reason"
                    rules={[{required: true, message: '请输入采购原因'}]}
                >
                    <Input.TextArea rows={4} placeholder={"请输入采购原因，不超过1000字"} showCount={true}
                                    maxLength={1000}/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}} style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        重置
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
