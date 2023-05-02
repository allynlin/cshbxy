import {App, Button, DatePicker, Form, Input, Modal, Typography} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';

import {addLeave} from "../../component/axios/api";
import {useStyles} from "../../webStyle";

const {Title, Paragraph} = Typography;
const {TextArea} = Input;

const LeaveForm = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const navigate = useNavigate();
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 监听表单数据
    const [form] = Form.useForm();
    const reason = Form.useWatch('reason', form);
    const leaveTime = Form.useWatch('leaveTime', form);


    // 表单提交
    const submitForm = () => {
        addLeave(reason, leaveTime[0].format('YYYY-MM-DD HH:mm:ss'), leaveTime[1].format('YYYY-MM-DD HH:mm:ss')).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: "请假申请提交成功",
                        describe: "等待审批",
                        toPage: "查看申请记录",
                        toURL: '/leave-Record',
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

    const rangePresets: {
        label: string;
        value: [Dayjs, Dayjs];
    }[] = [
        {label: "今天", value: [dayjs(), dayjs()]},
        {label: "一天", value: [dayjs(), dayjs().add(1, 'day')]},
        {label: "一周", value: [dayjs(), dayjs().add(7, 'd')]},
        {label: "一月", value: [dayjs(), dayjs().add(30, 'd')]},
    ];

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
                    <Paragraph>请假时间：{leaveTime ? leaveTime[0].format('YYYY-MM-DD HH:mm:ss') : "未选择请假时间"}</Paragraph>
                    <Paragraph>销假时间：{leaveTime ? leaveTime[1].format('YYYY-MM-DD HH:mm:ss') : "未选择销假时间"}</Paragraph>
                    <Paragraph>原因：{reason}</Paragraph>
                </Typography>
            </Modal>
            <Title level={2}>请假申请</Title>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
            >

                <Form.Item
                    label="请假时间"
                    name="leaveTime"
                    rules={[{required: true, message: "请选择请假时间"}]}
                >
                    <DatePicker.RangePicker
                        showTime={true}
                        format={"YYYY-MM-DD HH:mm:s"}
                        presets={rangePresets}
                    />
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

const Leave = () => {
    return (
        <App>
            <LeaveForm/>
        </App>
    )
}

export default Leave;
