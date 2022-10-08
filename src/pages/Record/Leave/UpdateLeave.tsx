import {Button, DatePicker, Form, Input, message, Modal} from 'antd';
import React, {useState} from 'react';
import moment from "moment/moment";
import {updateLeave} from "../../../component/axios/api";
import {ExclamationCircleOutlined} from "@ant-design/icons";

interface prop {
    state: any,
    getNewContent: any
}

export const UpdateLeave = (props: prop) => {
    const content = props.state;
    // 监听表单数据
    const [form] = Form.useForm();
    const reason = Form.useWatch('reason', form);
    const leaveTime = Form.useWatch('leaveTime', form);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        showUpdateConfirm();
    };

    const handleCancel = () => {
        showCancelConfirm();
    };

    // 修改确认框
    const showUpdateConfirm = () => {
        Modal.confirm({
            title: '确认修改申请吗？',
            icon: <ExclamationCircleOutlined/>,
            content: '修改后需要重新进行审批，是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            style: {
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(255,255,255,0.6)'
            },
            mask: false,
            onOk() {
                setConfirmLoading(true);
                updateForm();
            }
        });
    };

    // 放弃修改确认框
    const showCancelConfirm = () => {
        Modal.confirm({
            title: '放弃修改？',
            icon: <ExclamationCircleOutlined/>,
            content: '放弃修改后将不会保存修改，是否确认放弃？',
            okText: '放弃',
            okType: 'danger',
            cancelText: '继续修改',
            style: {
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(255,255,255,0.6)'
            },
            mask: false,
            onOk() {
                setOpen(false);
            }
        });
    };

    const updateForm = () => {
        updateLeave(content.uid, reason, leaveTime[0].format('YYYY-MM-DD HH:mm'), leaveTime[1].format('YYYY-MM-DD HH:mm')).then(res => {
            message.success(res.msg);
            setOpen(false);
            setConfirmLoading(false);
            // props.getNewContent 返回给父组件,父组件接收一个对象，对象中有 reason,start_time,end_time
            props.getNewContent({
                reason: reason,
                start_time: leaveTime[0].format('YYYY-MM-DD HH:mm'),
                end_time: leaveTime[1].format('YYYY-MM-DD HH:mm')
            });
        }).catch(err => {
            message.error(err.msg);
            setConfirmLoading(false);
        })
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                修改
            </Button>
            <Modal
                title={'修改请假申请'}
                open={open}
                onOk={handleOk}
                mask={false}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                width={800}
                style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: 'rgba(255,255,255,0.6)'
                }}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{
                        // leaveTime: [content.start_time, content.end_time],
                        // 格式化 content.start_time 和 content.end_time
                        leaveTime: [moment(content.start_time, 'YYYY-MM-DD HH:mm:ss'), moment(content.end_time, 'YYYY-MM-DD HH:mm:ss')],
                        reason: content.reason
                    }}
                >

                    <Form.Item
                        label="请假时间"
                        name="leaveTime"
                        rules={[{required: true, message: '请选择请假时间'}]}
                    >
                        <DatePicker.RangePicker
                            showTime={true}
                            format={"YYYY-MM-DD HH:mm:ss"}
                            ranges={{
                                '快捷选择': [moment(), moment().add(1, 'days')],
                                '今天': [moment(), moment().endOf('day')],
                                '一天': [moment(), moment().add(1, 'days')],
                                '一周': [moment(), moment().add(1, 'weeks')],
                                '一月': [moment(), moment().add(1, 'months')],
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="请假原因"
                        name="reason"
                        rules={[{required: true, message: '请输入请假原因'}]}
                    >
                        <Input.TextArea rows={4} showCount={true}
                                        maxLength={500}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};