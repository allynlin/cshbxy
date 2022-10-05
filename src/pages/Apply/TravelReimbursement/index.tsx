import {
    Input,
    Modal,
    Button,
    Form,
    Select,
    Typography,
    InputNumber
} from 'antd';
import React, {useEffect, useState} from 'react';
import {
    checkLastTimeUploadFiles
} from "../../../component/axios/api";
import '../index.scss';
import {BaseInfo} from "../../../baseInfo";
import Spin from "../../../component/loading/Spin";
import FileUpLoad from "../../../component/FileUpLoad";

const {Title} = Typography;
const {Option} = Select;

const tableName = `travelreimbursement`;

const URL = `${BaseInfo}/api`;

const LeaveForm = () => {
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
        checkLastTimeUploadFiles(tableName).then(res => {
            if (res.code === 200) {
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
            }
            setIsRenderResult(false)
        })
    }

    // 表单提交
    const submitForm = () => {
        // teacherChangeDepartment(destination, expenses,reason).then(res => {
        //     setConfirmLoading(false);
        //     message.success(res.msg);
        //     navigate('/home');
        // }).catch(err => {
        //     setConfirmLoading(false);
        // })
    }

    const RenderModal: React.FC = () => {
        return (
            <Modal
                title="确认提交"
                mask={false}
                style={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: 'rgba(255,255,255,0.6)'
                }}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>出差目的地：{destination}</p>
                <p>出差费用：{expenses} {moneyType}</p>
                <p>出差原因：{reason}</p>
                {/*将变更材料 changeFile 中的 fileList 数组中的状态为 done 的每一项 name 输出出来*/}
                <p>变更材料：{
                    fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                }</p>
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
        isRenderResult ? <Spin/> :
            <div className={'body'}>
                <RenderModal/>
                <Title level={2} className={'tit'}>差旅报销申请</Title>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    onFinish={onFinish}
                    initialValues={{
                        file: fileList
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
    )
};

const Index = () => {
    return (
        <LeaveForm/>
    )
}

export default Index;