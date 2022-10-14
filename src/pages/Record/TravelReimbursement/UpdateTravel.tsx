import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from 'antd';
import React, {useState} from 'react';
import {updateLeave} from "../../../component/axios/api";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import FileUpLoad from "../../../component/axios/FileUpLoad";

interface prop {
    state: any,
    getNewContent: any
}

const {Option} = Select;

const tableName = `travelreimbursement`;

export const UpdateTravel = (props: prop) => {
    // 费用类型
    const [moneyType, setMoneyType] = useState<String>('CNY');
    // 文件上传列表
    const [fileList, setFileList] = useState<any>([]);
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
                        file: fileList,
                        destination: content.destination,
                        reason: content.reason,
                        expenses: content.expenses
                    }}
                >
                    <Form.Item
                        label="出差目的地"
                        name="destination"
                        rules={[{required: true, message: '请输入你的出差目的地'}]}
                    >
                        <Input showCount={true} maxLength={50}/>
                    </Form.Item>

                    <Form.Item
                        label="出差费用"
                        name="expenses"
                        rules={[{required: true, message: '请输入出差费用'}]}
                    >
                        <InputNumber addonAfter={
                            <Select defaultValue={content.moneyType} style={{width: 60}} onChange={e => {
                                setMoneyType(e)
                            }}>
                                <Option value="USD">$</Option>
                                <Option value="EUR">€</Option>
                                <Option value="GBP">£</Option>
                                <Option value="CNY">¥</Option>
                            </Select>
                        }/>
                    </Form.Item>

                    <Form.Item
                        label="出差原因"
                        name="reason"
                        rules={[{required: true, message: '请输入出差原因'}]}
                    >
                        <Input.TextArea rows={4} placeholder={"请输入出差原因，如超出1000字请提交附件"}
                                        showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>

                    <Form.Item
                        label="附件材料"
                        name="file"
                        rules={[{required: true, message: '请上传附件材料'}]}
                    >
                        <FileUpLoad
                            setTableName={tableName}
                            getList={(list: []) => {
                                setFileList(list)
                                form.setFieldsValue({
                                    file: list
                                })
                            }}
                            setList={fileList}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};