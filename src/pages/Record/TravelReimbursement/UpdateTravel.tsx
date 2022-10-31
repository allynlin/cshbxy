import {Button, Form, Input, InputNumber, message, Modal, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {checkLastTimeUploadFiles, updateTravelReimbursementApply} from "../../../component/axios/api";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import FileUpLoad from "../../../component/axios/FileUpLoad";
import {DownLoadURL} from "../../../baseInfo";

interface prop {
    state: any,
    fileList: any,
    getNewContent: any
}

const {Option} = Select;

const tableName = `travelreimbursement`;

export const UpdateTravel = (props: prop) => {
    const content = props.state;
    const list = props.fileList;
    // 费用类型
    const [moneyType, setMoneyType] = useState<String>(content.expenses.substring(content.expenses.length - 3, content.expenses.length));
    // 文件上传列表
    const [fileList, setFileList] = useState<any>([]);
    // 监听表单数据
    const [form] = Form.useForm();
    const destination = Form.useWatch('destination', form);
    const expenses = Form.useWatch('expenses', form);
    const reason = Form.useWatch('reason', form);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        // 遍历 list,转换成 fileList 需要的 uid,status,url,name
        let file = list.map((item: any) => {
            return {
                uid: item.fileName,
                name: item.oldFileName,
                status: 'done',
                url: `${DownLoadURL}/downloadFile?filename=${item.fileName}`,

            }
        })
        checkLastTimeUploadFiles(tableName).then(res => {
            if (res.code === 200) {
                // 遍历 res.body
                let oldList = res.body.map((item: any) => {
                    return {
                        uid: item.fileName,
                        name: item.oldFileName,
                        status: 'done',
                        url: `${DownLoadURL}/downloadFile?filename=${item.fileName}`,
                    }
                })
                // 合并 file 数组和 oldList 数组
                let newList = file.concat(oldList);
                setFileList(newList);
                console.log(newList);
                return;
            }
        })
        setFileList(file);
    }, [])

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        // 校验表单是否填写完整
        form.validateFields().then(() => {
            showUpdateConfirm();
        }).catch(() => {
            message.error('表单填写不完整');
        })
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
            content: '放弃修改后将不会保存修改修改内容，已上传文件将会保留在上传列表中，下次提交仍可使用，是否确认放弃？',
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
        updateTravelReimbursementApply(content.uid, destination, (expenses + moneyType), reason, tableName).then(res => {
            message.success(res.msg)
            setOpen(false);
            setConfirmLoading(false);
            props.getNewContent();
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
                    top: 20,
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
                        // 截取字符串，expenses 后三位不要
                        expenses: content.expenses.substring(0, content.expenses.length - 3),
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
                            <Select
                                defaultValue={content.expenses.substring(content.expenses.length - 3, content.expenses.length)}
                                style={{width: 60}} onChange={e => {
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
