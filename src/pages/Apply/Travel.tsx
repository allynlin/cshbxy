import React, {useEffect, useState} from 'react';
import {App, Button, Form, Input, InputNumber, Modal, Select, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';

import {addTravelReimbursement, checkLastTimeUploadFiles} from "../../component/axios/api";
import {BaseInfo, tableName} from "../../baseInfo";
import Spin from "../../component/LoadingSkleton";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {useStyles} from "../../styles/webStyle";

const {Title, Paragraph} = Typography;
const {Option} = Select;
const {TextArea} = Input;

const URL = `${BaseInfo}/api`;

const LeaveForm = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const navigate = useNavigate();

    // 费用类型
    const [moneyType, setMoneyType] = useState<String>('CNY');
    // 文件上传列表
    const [fileList, setFileList] = useState<any>([]);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 展示表单前查询上次提交的文件
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    // 监听表单数据
    const [form] = Form.useForm();
    const destination = Form.useWatch('destination', form);
    const expenses = Form.useWatch('expenses', form);
    const reason = Form.useWatch('reason', form);

    useEffect(() => {
        checkUploadFilesList();
    }, [])

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName.travel).then(res => {
            setIsRenderResult(false)
            // 遍历 res.body
            const fileList = res.body.map((item: any) => {
                return {
                    uid: item.fileName,
                    name: item.oldFileName,
                    status: 'done',
                    url: `${URL}/downloadFile?filename=${item.fileName}`,
                }
            })
            setFileList(fileList)
        })
    }

    // 表单提交
    const submitForm = () => {
        addTravelReimbursement(destination, (expenses + moneyType), reason, tableName.travel).then(res => {
            if (res.code !== 200) {
                message.error(res.msg);
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: "差旅报销申请提交成功",
                        describe: "等待审批",
                        toPage: "查看申请记录",
                        toURL: '/travel-Record',
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
        isRenderResult ? <Spin/> :
            <div className={classes.cshbxy100Per}>
                <Modal
                    title="确认"
                    open={isModalVisible}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <Typography>
                        <Paragraph>目的地：{destination}</Paragraph>
                        <Paragraph>费用：{expenses} {moneyType}</Paragraph>
                        <Paragraph>原因：{reason}</Paragraph>
                        <Paragraph>文件：{
                            fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                        }</Paragraph>
                    </Typography>
                </Modal>
                <Title level={2}>差旅报销申请</Title>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        file: fileList
                    }}
                >
                    <Form.Item
                        label="目的地"
                        name="destination"
                        rules={[{
                            required: true,
                            message: "请输入目的地"
                        }]}
                    >
                        <Input showCount={true} maxLength={50}
                               placeholder="请输入目的地"/>
                    </Form.Item>

                    <Form.Item
                        label="费用"
                        name="expenses"
                        rules={[{required: true, message: "请输入费用"}]}
                    >
                        <InputNumber
                            placeholder="请输入费用"
                            addonAfter={
                                <Select defaultValue={moneyType} style={{width: 60}} onChange={e => {
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
                        label="原因"
                        name="reason"
                        rules={[{required: true, message: "请输入原因"}]}
                    >
                        <TextArea showCount rows={4} maxLength={1000} placeholder="请输入原因"/>
                    </Form.Item>

                    <Form.Item
                        label="文件"
                        name="file"
                        rules={[{required: true, message: "请选择文件"}]}
                    >
                        <FileUpLoad
                            setTableName={tableName.travel}
                            getList={(list: []) => {
                                setFileList(list)
                                form.setFieldsValue({
                                    file: list
                                })
                            }}
                            setList={fileList}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>重置</Button>
                    </Form.Item>
                </Form>
            </div>
    )
};

const Travel = () => {
    return (
        <App>
            <LeaveForm/>
        </App>
    )
}

export default Travel;
